import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { test } from 'node:test'

const root = resolve(import.meta.dirname, '../..')

function run(cwd, command, args, expected = 0) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' })
  assert.equal(
    result.status,
    expected,
    `${command}: ${result.stdout}\n${result.stderr}`,
  )
  return result.stdout.trim()
}

function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), 'resume pack '))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  cpSync(join(root, 'ai'), join(dir, 'ai'), { recursive: true })
  cpSync(join(root, 'wiki'), join(dir, 'wiki'), { recursive: true })
  run(dir, 'git', ['init', '-b', 'master'])
  run(dir, 'git', ['config', 'user.name', 'Pack fixture'])
  run(dir, 'git', ['config', 'user.email', 'fixture@example.invalid'])
  writeFileSync(join(dir, '.gitignore'), 'requirements/\n')
  writeFileSync(join(dir, 'tracked.txt'), 'baseline\n')
  run(dir, 'git', ['add', '.'])
  run(dir, 'git', [
    '-c',
    'commit.gpgsign=false',
    'commit',
    '-m',
    'Fixture baseline',
  ])
  return dir
}

test('requirement setup creates a codex branch and preserves resumed notes', (t) => {
  const dir = fixture(t)
  run(dir, 'sh', ['ai/scripts/start-requirement.sh', 'Readable timeline!'])
  assert.equal(
    run(dir, 'git', ['branch', '--show-current']),
    'codex/readable-timeline',
  )
  assert.equal(run(dir, 'git', ['status', '--porcelain']), '')
  const plan = join(dir, 'requirements/readable-timeline/PLAN.md')
  const notes = readFileSync(plan, 'utf8') + '\nPreserve these notes.\n'
  writeFileSync(plan, notes)
  run(dir, 'sh', [
    'ai/scripts/start-requirement.sh',
    '--stay-on-current-branch',
    'Readable timeline!',
  ])
  assert.equal(readFileSync(plan, 'utf8'), notes)
  run(dir, 'sh', ['ai/scripts/lint-requirements.sh'])
  assert.match(
    run(dir, 'sh', ['ai/scripts/list-requirements.sh', '--open']),
    /readable-timeline/,
  )
})

test('requirement setup refuses a dirty branch switch and preserves explicit stay', (t) => {
  const dir = fixture(t)
  writeFileSync(join(dir, 'tracked.txt'), 'Unrelated user work\n')
  run(dir, 'sh', ['ai/scripts/start-requirement.sh', 'New work'], 1)
  assert.equal(run(dir, 'git', ['branch', '--show-current']), 'master')
  run(dir, 'sh', ['ai/scripts/start-requirement.sh', '--no-switch', 'New work'])
  assert.equal(
    readFileSync(join(dir, 'tracked.txt'), 'utf8'),
    'Unrelated user work\n',
  )
  run(dir, 'git', ['switch', '-c', 'codex/unrelated'])
  run(
    dir,
    'sh',
    ['ai/scripts/start-requirement.sh', '--no-switch', 'New work'],
    1,
  )
  assert.equal(run(dir, 'git', ['branch', '--show-current']), 'codex/unrelated')
})

test('requirement setup supports gitfiles in linked worktrees', (t) => {
  const dir = fixture(t)
  const worktree = join(dir, 'linked worktree')
  run(dir, 'git', ['worktree', 'add', '-b', 'codex/worktree', worktree])
  run(worktree, 'sh', [
    'ai/scripts/start-requirement.sh',
    '--no-switch',
    'Worktree task',
  ])
  assert.equal(run(worktree, 'git', ['status', '--porcelain']), '')
  run(worktree, 'sh', ['ai/scripts/lint-requirements.sh'])
})

test('reminder hook preserves quotes, tabs and backslashes as valid JSON', (t) => {
  const dir = fixture(t)
  const line = 'A "quoted" path C:\\resume\twith a tab.'
  writeFileSync(
    join(dir, 'wiki/index.md'),
    `# Wiki\n\n## Overview\n\n${line}\n`,
  )
  for (const event of ['UserPromptSubmit', 'SubagentStart', 'BeforeAgent']) {
    const result = JSON.parse(
      run(dir, 'sh', ['ai/scripts/wiki-reminder-hook.sh', event]),
    )
    assert.equal(result.hookSpecificOutput.hookEventName, event)
    assert.ok(result.hookSpecificOutput.additionalContext.includes(line))
  }
  const copilot = JSON.parse(
    run(dir, 'sh', [
      'ai/scripts/wiki-reminder-hook.sh',
      'sessionStart',
      'copilot',
    ]),
  )
  assert.ok(copilot.additionalContext.includes(line))
})

test('installed native hook commands emit context from a nested working directory', () => {
  for (const file of [
    '.claude/settings.json',
    '.codex/hooks.json',
    '.gemini/settings.json',
  ]) {
    const config = JSON.parse(readFileSync(join(root, file), 'utf8'))
    for (const [event, groups] of Object.entries(config.hooks)) {
      for (const group of groups) {
        for (const hook of group.hooks) {
          assert.equal(hook.type, 'command')
          assert.ok(hook.timeout > 0)
          const output = JSON.parse(
            run(join(root, 'src'), 'sh', ['-c', hook.command]),
          )
          assert.equal(output.hookSpecificOutput.hookEventName, event)
          assert.match(
            output.hookSpecificOutput.additionalContext,
            /wiki\/index.md/,
          )
        }
      }
    }
  }
  const config = JSON.parse(
    readFileSync(join(root, '.github/hooks/wiki-reminder.json'), 'utf8'),
  )
  for (const hooks of Object.values(config.hooks)) {
    for (const hook of hooks) {
      const output = JSON.parse(
        run(resolve(root, hook.cwd), 'sh', ['-c', hook.bash]),
      )
      assert.match(output.additionalContext, /wiki\/index.md/)
    }
  }
})

test('native skill adapters resolve to canonical shared instructions', () => {
  for (const client of ['.agents', '.claude', '.gemini', '.github']) {
    for (const skill of ['handoff', 'interview-questions']) {
      const dir = join(root, client, 'skills', skill)
      const adapter = readFileSync(join(dir, 'SKILL.md'), 'utf8')
      const pointer = adapter.match(/`([^`]+SKILL\.md)`/)[1]
      assert.equal(
        resolve(dir, pointer),
        join(root, 'ai/skills', skill, 'SKILL.md'),
      )
    }
  }
})

test('wiki lint rejects broken links and missing index entries', (t) => {
  const dir = fixture(t)
  const wiki = join(dir, 'test-wiki')
  mkdirSync(wiki)
  writeFileSync(join(wiki, 'index.md'), '# Index\n')
  writeFileSync(
    join(wiki, 'page.md'),
    '---\ntitle: Page\ndomain: guides\ntags: [test]\nstatus: current\nlast_updated: 2026-09-16\n---\n\n[Broken](missing.md)\n',
  )
  const output = run(
    dir,
    'sh',
    ['ai/scripts/wiki-lint.sh', '--strict-placeholders', 'test-wiki'],
    1,
  )
  assert.match(output, /broken link/)
  assert.match(output, /missing index entry/)
})

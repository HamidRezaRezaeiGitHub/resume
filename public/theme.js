// Apply the saved/system theme before the page paints, including on reload.
;(function () {
  var theme
  try {
    theme = localStorage.getItem('resume-theme')
  } catch (_) {}
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  var meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.content = theme === 'dark' ? '#181c19' : '#f5f5ed'
})()

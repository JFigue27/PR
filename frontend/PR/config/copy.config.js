// this is a custom dictionary to make it easy to extend/override
// provide a name for an entry, it can be anything such as 'copyAssets' or 'copyFonts'
// then provide an object with a `src` array of globs and a `dest` string
module.exports = {
  copyCommon: {
    src: ['{{SRC}}/common/**/*'],
    dest: '{{WWW}}/common'
  },
  copyOidcFiles: {
    src: ['{{SRC}}/auth_redirect.html','{{SRC}}/silent-renew.html'],
    dest: '{{WWW}}'
  },
  copyReports: {
    src: ['{{SRC}}/reports/**/*'],
    dest: '{{WWW}}/reports'
  }
}
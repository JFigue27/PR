alertify.defaults = {
  // dialogs defaults
  autoReset: true,
  basic: false,
  closable: true,
  closableByDimmer: true,
  frameless: false,
  maintainFocus: true, // <== global default not per instance, applies to all dialogs
  maximizable: true,
  modal: true,
  movable: true,
  moveBounded: false,
  overflow: true,
  padding: true,
  pinnable: true,
  pinned: true,
  preventBodyShift: false, // <== global default not per instance, applies to all dialogs
  resizable: true,
  startMaximized: false,
  transition: 'pulse',

  // notifier defaults
  notifier: {
    delay: 2000,
    position: 'top-left',
    closeButton: false
  },

  // language resources 
  glossary: {
    title: 'NG 2',
    ok: 'OK',
    cancel: 'Cancel'
  },

  // theme settings
  theme: {
    input: 'ajs-input',
    ok: 'ajs-ok',
    cancel: 'ajs-cancel'
  }
};

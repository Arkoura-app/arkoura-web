export const INPUT_CLS =
  'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1C2B1E] ' +
  'focus:outline-none focus:ring-2 focus:ring-[#4A7A50]/20 focus:border-[#4A7A50] transition-colors'

export const INPUT_ERR_CLS = 'border-red-300 bg-red-50/30'
export const TEXTAREA_CLS = INPUT_CLS + ' resize-none'
export const SELECT_CLS = INPUT_CLS + ' bg-white'

export const LABEL_CLS = 'block text-xs font-medium text-gray-500 mb-1.5'

export const TOGGLE_TRACK_CLS =
  "w-10 h-6 bg-gray-200 rounded-full transition-colors peer-checked:bg-[#4A7A50] " +
  "after:content-[''] after:absolute after:top-[2px] after:left-[2px] " +
  "after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow " +
  "after:transition-transform peer-checked:after:translate-x-4"

export const SAVE_BTN_CLS =
  'w-full py-2.5 rounded-xl text-sm font-semibold text-white ' +
  'disabled:opacity-50 transition-opacity'

export const SAVE_BTN_STYLE = { background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }

export const EMPTY_STATE_CLS =
  'flex flex-col items-center justify-center py-16 text-center'

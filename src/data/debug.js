import util from 'util'

export function inspect(label, obj) {
   console.log('----------------------------------------------')
   console.log(`:: ${label}`)
   console.log(util.inspect(obj, {
      depth: 6,
      colors: false,
      showHidden: true
   }))
   console.log('----------------------------------------------')   
}
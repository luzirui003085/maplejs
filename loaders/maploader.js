import fs from 'fs'
import path from 'path'
import xml2js from 'xml2js'
import mongoose from 'mongoose'

export default function() {
  const readDir = Promise.promisify(fs.readdir)
  const dir = __dirname + '/../wz/Map.wz/Map'
  readDir(dir)
    .then(res => {
      return Promise.map(res.filter(r => r.startsWith('Map')), mapFolder => {
        return Promise.join(readDir(path.resolve(dir, mapFolder)), Promise.resolve(path.resolve(dir, mapFolder)))
      })
    }).each(t => {
      let [files, dir] = t
      files.forEach(f => {
        fs.readFile(path.join(dir, f), (err, data) => {
          let parser = new xml2js.Parser()
          parser.parseString(data, (err, data) => {
            let map = +f.split('.')[0]
            data.imgdir.imgdir.forEach(img => {
              if (img['$'].name === 'life') {
                if (!img.imgdir)
                  return
                img.imgdir.forEach(life => {
                  let type = life.string[0]['$'].value
                  if (type === 'n' && false) {
                    let data = {map: map}
                    life.string.forEach(prop => data[prop['$'].name] = +prop['$'].value)
                    life.int.forEach(prop => data[prop['$'].name] = +prop['$'].value)
                    data.objectId = data.id
                    delete data.id
                    mongoose.model('Npc').create(data).then(npc => console.log('Created')).catch(console.log)
                  } else if (type === 'm' && false) {
                    let data = {map: map}
                    life.string.forEach(prop => data[prop['$'].name] = +prop['$'].value)
                    life.int.forEach(prop => data[prop['$'].name] = +prop['$'].value)
                    data.objectId = data.id
                    data.id = +life['$'].name
                    mongoose.model('Monster').create(data).then(monster => console.log('Created')).catch(console.log)
                  }
                })
              } else if (img['$'].name === 'portal') {
                // img.imgdir.forEach(portal => {
                //   let data = {
                //     id: +portal['$'].name,
                //     map: map
                //   }
                //   portal.string.forEach(prop => data[translatePortal(prop['$'].name)] = prop['$'].value)
                //   portal.int.forEach(prop => data[translatePortal(prop['$'].name)] = +prop['$'].value)
                //   mongoose.model('MapPortal').create(data).then(p => console.log('Created')).catch(console.log)
                // })
              }
            })
          })
        })
      })
    }).catch(console.log)
}

function translatePortal(key) {
  switch(key) {
    case 'pn':
      return 'label'
    case 'tm':
      return 'destination'
    case 'tn':
      return 'destinationLabel'
    default:
      return key
  }
}

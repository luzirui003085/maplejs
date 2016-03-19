import mongoose from 'mongoose'
import { expect } from 'chai'
import { initializeDatabase } from '../config'
import packetProcessor from '../packets/processors/world'

describe('Model testing', () => {
  before(initializeDatabase)

  after(done => {
    mongoose.model('Account')
      .findOne({username: 'martin'})
      .then(account => account.remove())
      .then(() =>  mongoose.model('Character').findOne({name: 'martin'}))
      .then(char => char.remove())
      .then(() => mongoose.disconnect())
      .then(done)
      .catch(done)
  })

  it('Should create a account', done => {
    mongoose.model('Account').create({
      username: 'martin',
      password: 'martin'
    }).then(account => {
      expect(account.username).to.equal('martin')
      expect(account.isAdmin).to.equal(false)
      done()
    }).catch(done)
  })

  it('Should find the account', done => {
    mongoose.model('Account').findOne({
      username: 'martin',
      password: 'martin'
    }).then(account => {
      expect(account).to.be.ok
      expect(account.getIntID()).to.be.ok
      done()
    }).catch(done)
  })

  it('Should find account and create character', done => {
    mongoose.model('Account').findOne({
      username: 'martin'
    }).then(account => {
      expect(account._id).to.be.ok
      return mongoose.model('Character')
        .create({
          name: 'martin',
          account: account
        })
    }).then(character => {
      expect(character).to.be.ok
      done()
    }).catch(done)
  })

  it('Should find character and populate account', done => {
    mongoose.model('Character')
      .findOne({name: 'martin'})
      .populate('account')
      .then(char => {
        expect(char.account.username).to.equal('martin')
        done()
      }).catch(done)
  })

  it('Should fail on finding a account', done => {
    mongoose.model('Account').findOne({
      username: 'martin',
      password: 'wrongpassword'
    }).then(account => {
      expect(account).to.be.null
      done()
    }).catch(done)
  })

  it('Should lookup on intid', done => {
    let charId
    mongoose.model('Character').findOne({
      name: 'martin'
    }).then(char => {
      charId = char._id.toString()
      return mongoose.model('Character').getFromIntID(char.getIntID())
    }).then(char => {
      expect(char._id.toString()).to.equal(charId)
      done()
    }).catch(done)
  })


})

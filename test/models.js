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

  it('Should fail on finding a account', done => {
    mongoose.model('Account').findOne({
      username: 'martin',
      password: 'wrongpassword'
    }).then(account => {
      expect(account).to.be.null
      done()
    }).catch(done)
  })

  it('Should hack', done => {
    done()
  })

})

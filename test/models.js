import mongoose from 'mongoose'
import { expect } from 'chai'
import { initializeDatabase } from '../config'
import packetProcessor from '../packets/processors/world'

describe('Model testing', () => {
  before(done => {
    initializeDatabase(process.env.TEST_DATABASE_URL).then(done).catch(done)
  })

  after(done => {
    mongoose.model('Account')
      .findOne({username: 'martin'})
      .then(account => account.remove())
      .then(() =>  mongoose.model('Character').remove())
      .then(() => mongoose.model('AccountCounter').remove())
      .then(() => mongoose.model('CharacterCounter').remove())
      .then(() => mongoose.model('Item').remove())
      .then(() => mongoose.disconnect())
      .then(done)
      .catch(done)
  })

  it('Should create an account', done => {
    mongoose.model('Account').create({
      username: 'martin',
      password: 'martin'
    }).then(account => {
      expect(account._id).to.equal(1)
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
      expect(account._id).to.equal(1)
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
      expect(character._id).to.equal(1)
      done()
    }).catch(done)
  })

  it('Should find character and populate account', done => {
    mongoose.model('Character')
      .findOne({_id: 1})
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

  it('Should create an item', done => {
    mongoose.model('Item').createItem(1302000, 1, -11)
      .then(item => {
        expect(item.item).to.equal(1302000)
        expect(item.position).to.equal(-11)
        expect(item.character).to.equal(1)
        done()
      }).catch(done)
  })

  it('Should create multiple items', done => {
    Promise.all([
      mongoose.model('Item').createItem(1302000, 1, -11),
      mongoose.model('Item').createItem(1302000, 1, -11)
      ]).then(items => {
        expect(items.length).to.equal(2)
        done()
      }).catch(done)
  })

  it('Should find items and populate stats', done => {
    mongoose.model('Item').find().populate('item')
      .then(items => {
        expect(items.length).to.equal(3)
        items.forEach(item => {
          expect(item.item.tuc).to.equal(7)
          expect(item.item.reqJob).to.equal(0)
          expect(item.item.price).to.equal(1)
        })
        done()
      }).catch(done)
  })

})

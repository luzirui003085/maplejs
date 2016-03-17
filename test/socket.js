import { generateHeader } from '../socket'
import PacketBuilder from '../packets/builder'
import { expect } from 'chai'

describe('Socket', () => {
  it('Should generate a ping header', () => {
    let header =  generateHeader([1,2,3,4], 2, 62)
    expect(header).to.equal([3,58,1,58])
  })
})

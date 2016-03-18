import { generateHeader, morphSequence, encryptPacket  } from '../socket'
import PacketBuilder from '../packets/builder'
import { expect } from 'chai'

describe('Socket', () => {
  it('Should generate a ping header', () => {
    let header = generateHeader([82, 48, 120, 115], 2, -15873)

    expect(header.compare(new Buffer([-71, -116, -69, -116]))).to.equal(0)
  })

  it('Should generate a ping packet', () => {
    let sendSequence = [82, 48, 120, 115]
    let version = -15873;
    let packet = new PacketBuilder(0x11)
    let encrypted = encryptPacket(packet, sendSequence, version)
    expect(encrypted.compare(new Buffer([-71, -116, -69, -116, -22, 33]))).to.equal(0)
  })
})

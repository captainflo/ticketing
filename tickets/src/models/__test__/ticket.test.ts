import { Ticket} from '../tickets'

it('Implements optimistic concurrency control', async (done)=>{
  //  Create an instance of ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  })

  //  save the ticket to the database
  await ticket.save()
  //  fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  //  make two separate changes to the tickets we fetched
  firstInstance!.set({price: 10})
  firstInstance!.set({price: 15})

  //  save the first fetched ticket
  await firstInstance!.save()

  //  save the second fetched ticket and expect an error
  try{
    await secondInstance!.save()
  }catch(err){
    return done()
  }

  throw new Error('should not reach this point')
 
})


it('increments the version number on multiple saves', async ()=>{
  //  Create an instance of ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  })

  //  save the ticket to the database
  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
})



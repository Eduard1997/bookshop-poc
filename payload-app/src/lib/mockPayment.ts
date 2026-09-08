export default async function mockPayment(cartId: string) {
 
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    console.log('Mock Payment Successful')
    return { success: true }
}
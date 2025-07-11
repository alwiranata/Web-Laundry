export type Order = {
  serviceType: "CUCI" | "SETRIKA" | "CUCI_SETRIKA"
  serviceCategory : "NORMAL" | "EXPRESS"
  priceCategory ?: number //kalau dia cuci baju
  category: string
  weight ?: number
  dropOffDate: string
  pickUpDate: string
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  statusPayment : "PENDING" | "COMPLETED" 
  price ?: number 
}

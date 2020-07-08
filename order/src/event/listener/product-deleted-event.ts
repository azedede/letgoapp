import { Listener, Subject, productEventDeleted } from "@localmarket/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { product } from "../../model/product";

export class ProductEventDeleted extends Listener<productEventDeleted> {
  subject: productEventDeleted["subject"] = Subject.PRODUCT_DELETED;
  queueGroupName = queueGroupName;

  async onMessage(data: productEventDeleted["data"], msg: Message) {
    const tobeDeleted = await product.findById(data.id);
    //check product
    if (!tobeDeleted) throw new Error("product not found>>order service productdeleted");
    //delete product
    await tobeDeleted.remove();
    msg.ack();
  }
}

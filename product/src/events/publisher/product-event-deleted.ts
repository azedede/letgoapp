import { Publisher, Subject, productEventDeleted } from "@localmarket/common";

export class ProductEventDeleted extends Publisher<productEventDeleted> {
  subject: productEventDeleted["subject"] = Subject.PRODUCT_DELETED;
}

import {Publisher,Subject,productEventCreated} from '@localmarket/common'

export class ProductEventCreated extends Publisher<productEventCreated>{
    subject:productEventCreated['subject'] = Subject.PRODUCT_CREATED

}
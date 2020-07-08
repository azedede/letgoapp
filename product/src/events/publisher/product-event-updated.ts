import {Publisher,Subject,productEventUpdated} from '@localmarket/common'

export class ProductEventUpdated extends Publisher<productEventUpdated>{
    subject:productEventUpdated['subject'] = Subject.PRODUCT_UPDATED

}
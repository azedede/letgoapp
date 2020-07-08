import { Listener, profileEventUpdate, Subject } from "@localmarket/common";
import { queueGroupName } from "./queue-group-name";
import { profile } from "../../model/profile";
import { Message } from "node-nats-streaming";

export class profileEventsUpdated extends Listener<profileEventUpdate> {
  subject:Subject.PROFILE_UPDATED = Subject.PROFILE_UPDATED;
  queueGroupName = queueGroupName;
  async onMessage(data: profileEventUpdate["data"], msg: Message) {
    //updating received data into product:service >> profile
    const prof = await profile.findByEvent(data) 
   if(!prof)  throw new Error('profile not found: in product service') 
   const {id, brandName,username, gsm,location,image}= data
   prof.set({
    id,
    brandName,
    location,
    username,
    gsm,
    profilePic:image
   })
   
   await prof.save()
   msg.ack()
   
  }
}


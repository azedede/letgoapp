import { Listener, profileEventCreated, Subject } from "@localmarket/common";
import { queueGroupName } from "./queue-group-name";
import { profile } from "../../model/profile";
import { Message } from "node-nats-streaming";

export class profileEventsCreated extends Listener<profileEventCreated> {
  subject:Subject.PROFILE_CREATED = Subject.PROFILE_CREATED;
  queueGroupName = queueGroupName;
  async onMessage(data: profileEventCreated["data"], msg: Message) {
    //storing received data into product:service >> profile
    const Profile = profile.build({
      id: data.id,
      brandName: data.brandName,
      gsm: data.gsm,
      location: data.location,
      username: data.username,
      profilePic:data.image
    });
    //save
    await Profile.save();
    //acknolegde msg
    msg.ack();
  }
}


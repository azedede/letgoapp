import { Subject, profileEventCreated, Publisher } from "@localmarket/common";

export class ProfileEventCreated extends Publisher<profileEventCreated> {
  subject: profileEventCreated["subject"] = Subject.PROFILE_CREATED;
}

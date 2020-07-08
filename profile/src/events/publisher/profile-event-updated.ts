import { Subject, profileEventUpdate, Publisher } from "@localmarket/common";

export class ProfileEventUpdate extends Publisher<profileEventUpdate> {
  subject: profileEventUpdate["subject"] = Subject.PROFILE_UPDATED;
}

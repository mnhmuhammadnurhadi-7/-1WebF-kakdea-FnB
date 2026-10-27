import { AboutCard } from "./AboutCard";
import { ContactCard } from "./ContactCard";
import { HeadlineCard } from "./HeadlineCard";
import type { CmsContent } from "../shared/types";

type ContentTabProps = {
  headline: CmsContent;
  about: CmsContent;
  contact: CmsContent;
  onEditHeadline: () => void;
  onEditAbout: () => void;
  onEditContact: () => void;
};

export function ContentTab({ headline, about, contact, onEditHeadline, onEditAbout, onEditContact }: ContentTabProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.45fr_1fr]">
      <HeadlineCard content={headline} onEdit={onEditHeadline} />
      <div className="flex flex-col gap-5">
        <AboutCard content={about} onEdit={onEditAbout} />
        <ContactCard content={contact} onEdit={onEditContact} />
      </div>
    </div>
  );
}

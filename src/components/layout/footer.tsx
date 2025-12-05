import React from "react";
import SocialIcon from "../ui/socialIcon";

type Props = {};

const Footer = ({}: Props) => {
  return (
    <footer className="row-start-3 flex gap-6 px-4 md:px-6 lg:px-8 pb-8 flex-wrap justify-between items-end text-white footer">
      <section className=" md:flex justify-between w-full">
        <section className="mb-4 md:mb-0">
          <p className="font-bold mb-2">Udyoga Access</p>
          <p className="max-w-[25ch] text-xs">
            2nd Floor, No. 17, 20th Main Road, Ward No. 67, 1st R Block, W.O.C.
            Road, Rajajinagar, Bengaluru, Karnataka - 560010.
          </p>
        </section>
        <section className="md:text-right">
          <p className="font-bold mb-2">Contact Us</p>
          <ul className="flex gap-2 flex-wrap">
            <li>
              <SocialIcon
                alt="mail"
                imgPath="/assets/icons/icon-email.svg"
                label="Mail"
                link="mailto:admin@udyoga-access.com"
              />
            </li>
            <li>
              <SocialIcon
                alt="linkedin"
                imgPath="/assets/icons/icon-linkedin.svg"
                label="linkedin"
                link="mailto:admin@udyoga-access.com"
              />
            </li>
          </ul>
        </section>
      </section>
    </footer>
  );
};

export default Footer;

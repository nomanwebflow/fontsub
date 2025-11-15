"use client";

import { Section, Block, Link, Heading } from "@/devlink/_Builtin";

export default function Home() {
  return (
    <Section
      tag="section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)",
        padding: "2rem",
      }}
    >
      <Block tag="div" className="container">
        <Block
          tag="div"
          className="hero-split"
          style={{
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <Heading
            tag="h1"
            className="margin-bottom-24px"
            style={{
              fontSize: "3.5rem",
              fontWeight: 700,
              background: "linear-gradient(83.21deg, #3245ff 0%, #bc52ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "1.5rem",
            }}
          >
            FontSub - Webflow Cloud
          </Heading>
          <Block tag="p" className="margin-bottom-24px" style={{ fontSize: "1.2rem", color: "#495057", marginBottom: "2rem" }}>
            Your Font Subsetter application is now running on Webflow Cloud!
            This app is integrated with your Webflow design system via DevLink.
          </Block>
          <Block tag="div" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              button={true}
              options={{
                href: "https://developers.webflow.com/webflow-cloud",
              }}
              className="button-primary"
              style={{
                borderRadius: "8px",
                background: "#146ef5",
                color: "#ffffff",
                padding: "12px 24px",
                textDecoration: "none",
                fontWeight: 600,
                boxShadow:
                  "0px 0.5px 1px rgba(0, 0, 0, 0.25), inset 0px 29px 23px -16px rgba(255, 255, 255, 0.04)",
              }}
            >
              Learn More
            </Link>
            <Link
              button={true}
              options={{
                href: "/",
              }}
              className="button-secondary"
              style={{
                borderRadius: "8px",
                background: "#ffffff",
                color: "#146ef5",
                padding: "12px 24px",
                textDecoration: "none",
                fontWeight: 600,
                border: "2px solid #146ef5",
              }}
            >
              Get Started
            </Link>
          </Block>
        </Block>
      </Block>
    </Section>
  );
}

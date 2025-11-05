import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Img,
  Section,
  Row,
  Column,
  Link,
} from "@react-email/components";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'tip-eteeap.vercel.app'; 

const logoUrl = `https://zwqrpmnpboyvvniboqrh.supabase.co/storage/v1/object/public/Assets/images/TIPLogo.png`;
const fbUrl = `https://zwqrpmnpboyvvniboqrh.supabase.co/storage/v1/object/public/Assets/images/FB.png`;
const xUrl = `https://zwqrpmnpboyvvniboqrh.supabase.co/storage/v1/object/public/Assets/images/x.png`;
const igUrl = `https://zwqrpmnpboyvvniboqrh.supabase.co/storage/v1/object/public/Assets/images/IG.png`;

interface EmailTemplateProps {
  subject: string;
  body: string; // This will be HTML
}

export const EmailTemplate = ({ subject, body }: EmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>{subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            // --- USE THE FULL URL ---
            src={logoUrl}
            width="50"
            height="50"
            alt="TIP Logo"
          />
        </Section>
        <Heading style={h1}>{subject}</Heading>
        <Section>
          <Text style={text} dangerouslySetInnerHTML={{ __html: body }}></Text>
        </Section>
        <Section style={footer}>
          <Row>
            <Column align="center">
              <Link href="https://www.facebook.com/TIP1962official">
                <Img
                  // --- USE THE FULL URL ---
                  src={fbUrl}
                  width="32"
                  height="32"
                  alt="Facebook"
                />
              </Link>
            </Column>
            <Column align="center">
              <Link href="https://twitter.com/TIP1962official">
                <Img
                  // --- USE THE FULL URL ---
                  src={xUrl}
                  width="32"
                  height="32"
                  alt="Twitter"
                />
              </Link>
            </Column>
            <Column align="center">
              <Link href="https://www.instagram.com/tip1962official/">
                <Img
                  // --- USE THE FULL URL ---
                  src={igUrl}
                  width="32"
                  height="32"
                  alt="Instagram"
                />
              </Link>
            </Column>
          </Row>
          <Text style={footerText}>
            Technological Institute of the Philippines
            <br />
            938 Aurora Blvd, Cubao, Quezon City, Metro Manila, Philippines
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// --- STYLES (No Changes) ---
const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};
// ... (rest of your styles are perfect)
const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
  width: "600px",
  margin: "0 auto",
};

const header = {
  textAlign: "center" as const,
  paddingBottom: "20px",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  lineHeight: "24px",
};

const footer = {
  paddingTop: "20px",
  borderTop: "1px solid #f0f0f0",
};

const footerText = {
  color: "#666",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "18px",
};
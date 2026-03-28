import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WaitlistConfirmationProps {
  name?: string
}

export default function WaitlistConfirmation({ name }: WaitlistConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;re on the Arkoura waitlist — we&apos;ll be in touch soon.</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'middle', width: '36px' }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 24C4 24 6.5 12 14 8C21.5 4 24 5.5 24 5.5C24 5.5 21.5 14 17 18C12.5 22 4 24 4 24Z" fill="#4A7A50" />
                      <path d="M4 24L10 17" stroke="#2D5A35" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </td>
                  <td style={{ verticalAlign: 'middle', paddingLeft: '8px' }}>
                    <span style={wordmark}>Arkoura</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Main content */}
          <Section style={content}>
            {name ? <Text style={greeting}>Hi {name},</Text> : null}
            <Text style={heading}>You&apos;re on the list.</Text>
            <Text style={bodyText}>
              Thank you for joining the Arkoura waitlist. We&apos;re building something that
              matters — a personal health journal that becomes an emergency lifeline.
            </Text>

            {/* Feature list */}
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse', marginBottom: '32px' }}>
              <tbody>
                {[
                  'Free emergency QR profile — forever',
                  'Works in 20 languages',
                  'Your data, your control',
                ].map((feature) => (
                  <tr key={feature}>
                    <td style={{ width: '20px', verticalAlign: 'top', paddingTop: '2px' }}>
                      <span style={dot}>●</span>
                    </td>
                    <td>
                      <Text style={featureText}>{feature}</Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Section style={{ textAlign: 'center' }}>
              <Button href="https://arkoura.com" style={ctaButton}>
                Learn more at arkoura.com
              </Button>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>© 2026 Arkoura. Engineered for humanity.</Text>
            <Text style={footerText}>
              You&apos;re receiving this because you joined the Arkoura waitlist.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = {
  backgroundColor: '#F5F5F0',
  fontFamily: 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  margin: 0,
  padding: '40px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  maxWidth: '560px',
  margin: '0 auto',
  overflow: 'hidden',
}

const header: React.CSSProperties = {
  backgroundColor: '#F5F5F0',
  padding: '24px 40px',
  borderBottom: '1px solid #E8F2E6',
}

const wordmark: React.CSSProperties = {
  fontFamily: 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '20px',
  fontWeight: '800',
  color: '#1C2B1E',
  letterSpacing: '-0.5px',
}

const content: React.CSSProperties = {
  padding: '40px 40px 32px',
}

const greeting: React.CSSProperties = {
  fontSize: '16px',
  color: '#6B7280',
  margin: '0 0 6px',
}

const heading: React.CSSProperties = {
  fontFamily: 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '28px',
  fontWeight: '800',
  color: '#1C2B1E',
  margin: '0 0 16px',
  letterSpacing: '-0.5px',
}

const bodyText: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: '#374151',
  margin: '0 0 28px',
}

const dot: React.CSSProperties = {
  color: '#4A7A50',
  fontSize: '8px',
  lineHeight: '22px',
}

const featureText: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0 0 8px',
}

const ctaButton: React.CSSProperties = {
  backgroundColor: '#4A7A50',
  borderRadius: '10px',
  color: '#FFFFFF',
  fontSize: '14px',
  fontWeight: '600',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
}

const divider: React.CSSProperties = {
  borderColor: '#E8F2E6',
  margin: '0 40px',
}

const footerSection: React.CSSProperties = {
  padding: '24px 40px 32px',
}

const footerText: React.CSSProperties = {
  fontSize: '12px',
  color: '#9CA3AF',
  textAlign: 'center',
  margin: '0 0 4px',
}

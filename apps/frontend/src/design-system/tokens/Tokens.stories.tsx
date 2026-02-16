import type { Meta, StoryObj } from '@storybook/react';
import { colors, gradients, typography } from './index';

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          background: value,
          border: '1px solid #D9D9D9',
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
        <div style={{ fontSize: 12, color: '#666' }}>{value}</div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

const meta = {
  title: 'Design System/Tokens',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Colors: Story = {
  render: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {Object.entries(colors).map(([group, values]) => (
        <Section key={group} title={group.charAt(0).toUpperCase() + group.slice(1)}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {typeof values === 'string' ? (
              <ColorSwatch name={group} value={values} />
            ) : (
              Object.entries(values).map(([shade, hex]) => (
                <ColorSwatch key={shade} name={`${group}-${shade}`} value={hex} />
              ))
            )}
          </div>
        </Section>
      ))}
    </div>
  ),
};

export const Gradients: Story = {
  render: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {Object.entries(gradients).map(([name, value]) => (
        <div key={name} style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{name}</div>
          <div
            style={{
              height: 48,
              borderRadius: 8,
              background: value,
            }}
          />
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{value}</div>
        </div>
      ))}
    </div>
  ),
};

export const Typography: Story = {
  render: () => {
    const { fontFamily, fontWeight, ...scales } = typography;

    return (
      <div style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Section title="Font Families">
          {Object.entries(fontFamily).map(([name, value]) => (
            <div key={name} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
              <div style={{ fontFamily: value, fontSize: 20 }}>
                The quick brown fox jumps over the lazy dog
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>{value}</div>
            </div>
          ))}
        </Section>

        <Section title="Font Weights">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {Object.entries(fontWeight).map(([name, value]) => (
              <div key={name} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: value, fontSize: 24, fontFamily: fontFamily.primary }}>Aa</div>
                <div style={{ fontSize: 12 }}>{name} ({value})</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type Scale">
          {Object.entries(scales).map(([name, scale]) => {
            const displaySize = Math.min(scale.size, 64);
            return (
              <div key={name} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                  {name} — {scale.size}px / {scale.lineHeight}px
                </div>
                <div
                  style={{
                    fontSize: displaySize,
                    lineHeight: `${Math.min(scale.lineHeight, 72)}px`,
                    fontFamily: fontFamily.primary,
                    fontWeight: 600,
                  }}
                >
                  MealDesk
                </div>
              </div>
            );
          })}
        </Section>
      </div>
    );
  },
};

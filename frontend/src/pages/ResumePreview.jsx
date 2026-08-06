import React from 'react';

// ─── Shared Helpers ───────────────────────────────────────────────────────────

const fmt = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

const dateRange = (start, end, current, currentLabel = 'Present') =>
  [fmt(start), current ? currentLabel : fmt(end)].filter(Boolean).join(' – ');

// ─── Template: Modern (two-column, indigo left sidebar) ──────────────────────

const ModernTemplate = ({ resume }) => {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [], certifications = [], projects = [] } = resume;

  return (
    <div className="font-sans text-sm text-gray-800" style={{ fontFamily: 'Georgia, serif', minHeight: '297mm' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '32px 32px 24px', color: 'white' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.5px' }}>{p.fullName || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', opacity: 0.9, marginTop: '8px' }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>✆ {p.phone}</span>}
          {p.location && <span>⌖ {p.location}</span>}
          {p.linkedin && <span>in {p.linkedin}</span>}
          {p.github && <span>⌥ {p.github}</span>}
          {p.portfolio && <span>◈ {p.portfolio}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0, background: 'white' }}>
        {/* Left - main content */}
        <div style={{ padding: '24px 24px 24px 32px', borderRight: '1px solid #f0f0f0' }}>
          {summary?.content && (
            <Section title="Professional Summary">
              <p style={{ lineHeight: 1.7, color: '#4b5563' }}>{summary.content}</p>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Work Experience">
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>{exp.position || 'Position'}</p>
                      <p style={{ color: '#4f46e5', fontWeight: 600, fontSize: '13px' }}>{exp.company}</p>
                    </div>
                    <p style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {dateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                      {exp.location ? ` · ${exp.location}` : ''}
                    </p>
                  </div>
                  {exp.description && <p style={{ marginTop: '6px', color: '#6b7280', lineHeight: 1.6 }}>{exp.description}</p>}
                  {exp.achievements?.length > 0 && (
                    <ul style={{ marginTop: '6px', paddingLeft: '16px' }}>
                      {exp.achievements.map((a, j) => <li key={j} style={{ color: '#6b7280', lineHeight: 1.6 }}>{a}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects">
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontWeight: 700, fontSize: '13px' }}>{proj.name}</p>
                    {proj.url && <a href={proj.url} style={{ fontSize: '11px', color: '#4f46e5' }}>View →</a>}
                  </div>
                  {proj.technologies?.length > 0 && (
                    <p style={{ fontSize: '11px', color: '#4f46e5', marginBottom: '4px' }}>{proj.technologies.join(' · ')}</p>
                  )}
                  {proj.description && <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{proj.description}</p>}
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Right - sidebar */}
        <div style={{ padding: '24px 24px 24px 20px', background: '#fafafa' }}>
          {education.length > 0 && (
            <Section title="Education">
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <p style={{ fontWeight: 700, fontSize: '13px' }}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                  <p style={{ color: '#4f46e5', fontSize: '12px' }}>{edu.institution}</p>
                  <p style={{ color: '#9ca3af', fontSize: '11px' }}>{dateRange(edu.startDate, edu.endDate, edu.currentlyStudying)}</p>
                  {edu.grade && <p style={{ fontSize: '11px', color: '#6b7280' }}>Grade: {edu.grade}</p>}
                </div>
              ))}
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skills.map((sk, i) => (
                  <span key={i} style={{ background: '#ede9fe', color: '#5b21b6', borderRadius: '999px', padding: '2px 10px', fontSize: '11px', fontWeight: 600 }}>
                    {sk.name}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {certifications.length > 0 && (
            <Section title="Certifications">
              {certifications.map((cert, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: 600, fontSize: '12px' }}>{cert.name}</p>
                  <p style={{ color: '#6b7280', fontSize: '11px' }}>{cert.issuingOrganization}</p>
                  {cert.issueDate && <p style={{ color: '#9ca3af', fontSize: '11px' }}>{fmt(cert.issueDate)}</p>}
                </div>
              ))}
            </Section>
          )}

          {(p.linkedin || p.github || p.portfolio || p.website) && (
            <Section title="Links">
              {p.linkedin && <p style={{ fontSize: '11px', marginBottom: '4px' }}>🔗 {p.linkedin}</p>}
              {p.github && <p style={{ fontSize: '11px', marginBottom: '4px' }}>⌥ {p.github}</p>}
              {p.portfolio && <p style={{ fontSize: '11px', marginBottom: '4px' }}>◈ {p.portfolio}</p>}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Template: Classic (single column, clean black and white) ─────────────────

const ClassicTemplate = ({ resume }) => {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [], certifications = [], projects = [] } = resume;

  return (
    <div style={{ fontFamily: '"Times New Roman", serif', fontSize: '13px', color: '#1a1a1a', padding: '32px 40px', background: 'white', minHeight: '297mm' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #1a1a1a', paddingBottom: '14px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '1px', marginBottom: '6px' }}>{p.fullName || 'Your Name'}</h1>
        <div style={{ fontSize: '12px', color: '#555', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </div>

      {summary?.content && <ClassicSection title="OBJECTIVE"><p style={{ lineHeight: 1.7 }}>{summary.content}</p></ClassicSection>}

      {experience.length > 0 && (
        <ClassicSection title="EXPERIENCE">
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{exp.position}</strong>
                <span style={{ fontSize: '11px', color: '#666' }}>{dateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <em style={{ color: '#444' }}>{exp.company}</em>
                <span style={{ fontSize: '11px', color: '#888' }}>{exp.location}</span>
              </div>
              {exp.description && <p style={{ marginTop: '4px', color: '#444', lineHeight: 1.6 }}>{exp.description}</p>}
              {exp.achievements?.length > 0 && (
                <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                  {exp.achievements.map((a, j) => <li key={j} style={{ color: '#444', lineHeight: 1.5 }}>{a}</li>)}
                </ul>
              )}
            </div>
          ))}
        </ClassicSection>
      )}

      {education.length > 0 && (
        <ClassicSection title="EDUCATION">
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{edu.degree} {edu.fieldOfStudy ? `– ${edu.fieldOfStudy}` : ''}</strong>
                <span style={{ fontSize: '11px', color: '#666' }}>{dateRange(edu.startDate, edu.endDate, edu.currentlyStudying)}</span>
              </div>
              <em>{edu.institution}</em>
              {edu.grade && <span style={{ color: '#666', fontSize: '11px' }}> · {edu.grade}</span>}
            </div>
          ))}
        </ClassicSection>
      )}

      {skills.length > 0 && (
        <ClassicSection title="SKILLS">
          <p>{skills.map((s) => s.name).join(' · ')}</p>
        </ClassicSection>
      )}

      {certifications.length > 0 && (
        <ClassicSection title="CERTIFICATIONS">
          {certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <strong>{cert.name}</strong> – {cert.issuingOrganization}
              {cert.issueDate && <span style={{ color: '#888', fontSize: '11px' }}> ({fmt(cert.issueDate)})</span>}
            </div>
          ))}
        </ClassicSection>
      )}

      {projects.length > 0 && (
        <ClassicSection title="PROJECTS">
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <strong>{proj.name}</strong>
              {proj.technologies?.length > 0 && <em style={{ color: '#555' }}> ({proj.technologies.join(', ')})</em>}
              {proj.description && <p style={{ color: '#444', marginTop: '2px' }}>{proj.description}</p>}
            </div>
          ))}
        </ClassicSection>
      )}
    </div>
  );
};

// ─── Template: Minimal (whitespace heavy, modern sans-serif) ──────────────────

const MinimalTemplate = ({ resume }) => {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [], certifications = [], projects = [] } = resume;
  

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '13px', color: '#374151', padding: '40px 48px', background: 'white', minHeight: '297mm' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '-1px', color: '#111827', marginBottom: '4px' }}>{p.fullName || 'Your Name'}</h1>
      <div style={{ height: '3px', width: '48px', background: '#111827', marginBottom: '12px' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#6b7280', marginBottom: '32px' }}>
        {p.email && <span>{p.email}</span>}
        {p.phone && <span>{p.phone}</span>}
        {p.location && <span>{p.location}</span>}
        {p.linkedin && <span>{p.linkedin}</span>}
        {p.github && <span>{p.github}</span>}
      </div>

      {summary?.content && (
        <div style={{ marginBottom: '28px' }}>
          <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '13px' }}>{summary.content}</p>
        </div>
      )}

      {experience.length > 0 && (
        <MinSection title="Experience">
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600, color: '#111827' }}>{exp.position} <span style={{ color: '#6b7280', fontWeight: 400 }}>at</span> {exp.company}</span>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>{dateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}</span>
              </div>
              {exp.location && <span style={{ fontSize: '11px', color: '#9ca3af' }}>{exp.location}</span>}
              {exp.description && <p style={{ marginTop: '6px', color: '#6b7280', lineHeight: 1.7 }}>{exp.description}</p>}
            </div>
          ))}
        </MinSection>
      )}

      {education.length > 0 && (
        <MinSection title="Education">
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: '#111827' }}>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</span>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>{dateRange(edu.startDate, edu.endDate, edu.currentlyStudying)}</span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '12px' }}>{edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}</p>
            </div>
          ))}
        </MinSection>
      )}

      {skills.length > 0 && (
        <MinSection title="Skills">
          <p style={{ color: '#4b5563', lineHeight: 1.8 }}>{skills.map((s) => s.name).join('  ·  ')}</p>
        </MinSection>
      )}

      {projects.length > 0 && (
        <MinSection title="Projects">
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <span style={{ fontWeight: 600, color: '#111827' }}>{proj.name}</span>
              {proj.technologies?.length > 0 && <span style={{ color: '#9ca3af', fontSize: '11px' }}> · {proj.technologies.join(', ')}</span>}
              {proj.description && <p style={{ color: '#6b7280', marginTop: '4px', lineHeight: 1.6 }}>{proj.description}</p>}
            </div>
          ))}
        </MinSection>
      )}
    </div>
  );
};

// ─── Template: Professional (dark slate header) ───────────────────────────────

const ProfessionalTemplate = ({ resume }) => {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [], certifications = [], projects = [] } = resume;

  const skillsByCategory = (skills || []).reduce((acc, sk) => {
    const cat = sk.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sk.name);
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#1e293b', background: 'white', minHeight: '297mm' }}>
      {/* Dark header */}
      <div style={{ background: '#1e293b', color: 'white', padding: '32px 40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '6px' }}>{p.fullName || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>✆ {p.phone}</span>}
          {p.location && <span>◎ {p.location}</span>}
          {p.linkedin && <span>in {p.linkedin}</span>}
          {p.github && <span>⌥ {p.github}</span>}
        </div>
      </div>

      <div style={{ padding: '28px 40px' }}>
        {summary?.content && (
          <div style={{ background: '#f8fafc', borderLeft: '4px solid #334155', padding: '14px 20px', marginBottom: '24px', borderRadius: '0 8px 8px 0' }}>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>{summary.content}</p>
          </div>
        )}

        {experience.length > 0 && (
          <ProfSection title="Professional Experience">
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '20px', paddingLeft: '12px', borderLeft: '2px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>{exp.position}</strong>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{dateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}</span>
                </div>
                <p style={{ color: '#334155', fontStyle: 'italic', fontSize: '12px', marginBottom: '6px' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                {exp.description && <p style={{ color: '#475569', lineHeight: 1.7 }}>{exp.description}</p>}
                {exp.achievements?.length > 0 && (
                  <ul style={{ paddingLeft: '16px', marginTop: '6px' }}>
                    {exp.achievements.map((a, j) => <li key={j} style={{ color: '#475569', lineHeight: 1.6 }}>{a}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </ProfSection>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
          <div>
            {education.length > 0 && (
              <ProfSection title="Education">
                {education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: '12px' }}>
                    <strong style={{ fontSize: '13px' }}>{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</strong>
                    <p style={{ color: '#334155', fontSize: '12px' }}>{edu.institution}</p>
                    <p style={{ color: '#94a3b8', fontSize: '11px' }}>{dateRange(edu.startDate, edu.endDate, edu.currentlyStudying)}{edu.grade ? ` · ${edu.grade}` : ''}</p>
                  </div>
                ))}
              </ProfSection>
            )}
            {certifications.length > 0 && (
              <ProfSection title="Certifications">
                {certifications.map((cert, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <strong style={{ fontSize: '12px' }}>{cert.name}</strong>
                    <p style={{ color: '#475569', fontSize: '11px' }}>{cert.issuingOrganization} {cert.issueDate && `· ${fmt(cert.issueDate)}`}</p>
                  </div>
                ))}
              </ProfSection>
            )}
          </div>
          <div>
            {Object.keys(skillsByCategory).length > 0 && (
              <ProfSection title="Skills">
                {Object.entries(skillsByCategory).map(([cat, names]) => (
                  <div key={cat} style={{ marginBottom: '10px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{cat}</p>
                    <p style={{ color: '#475569', lineHeight: 1.7 }}>{names.join(', ')}</p>
                  </div>
                ))}
              </ProfSection>
            )}
          </div>
        </div>

        {projects.length > 0 && (
          <ProfSection title="Projects">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {projects.map((proj, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px' }}>
                  <strong style={{ fontSize: '13px' }}>{proj.name}</strong>
                  {proj.technologies?.length > 0 && <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{proj.technologies.join(' · ')}</p>}
                  {proj.description && <p style={{ color: '#475569', fontSize: '12px', lineHeight: 1.6 }}>{proj.description}</p>}
                </div>
              ))}
            </div>
          </ProfSection>
        )}
      </div>
    </div>
  );
};

// ─── Section Wrapper Components ───────────────────────────────────────────────

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#4f46e5', marginBottom: '10px', paddingBottom: '4px', borderBottom: '1px solid #e5e7eb' }}>{title}</h3>
    {children}
  </div>
);

const ClassicSection = ({ title, children }) => (
  <div style={{ marginBottom: '18px' }}>
    <h3 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1px', borderBottom: '1px solid #1a1a1a', paddingBottom: '3px', marginBottom: '10px' }}>{title}</h3>
    {children}
  </div>
);

const MinSection = ({ title, children }) => (
  <div style={{ marginBottom: '24px' }}>
    <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#9ca3af', marginBottom: '12px' }}>{title}</p>
    {children}
  </div>
);

const ProfSection = ({ title, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#1e293b', borderBottom: '2px solid #1e293b', paddingBottom: '4px', marginBottom: '12px' }}>{title}</h3>
    {children}
  </div>
);

// ─── Main Export ──────────────────────────────────────────────────────────────

const ResumePreview = ({ resume }) => {
  const template = resume?.template || 'modern';

  return (
    <div style={{ transform: 'scale(0.7)', transformOrigin: 'top left', width: '142%' }}>
      {template === 'modern' && <ModernTemplate resume={resume} />}
      {template === 'classic' && <ClassicTemplate resume={resume} />}
      {template === 'minimal' && <MinimalTemplate resume={resume} />}
      {template === 'professional' && <ProfessionalTemplate resume={resume} />}
    </div>
  );
};

export default ResumePreview;
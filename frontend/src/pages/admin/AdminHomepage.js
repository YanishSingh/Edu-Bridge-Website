import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, contentApi, getAdminToken } from '../../utils/api';

const DEFAULT_HOME_CONTENT = {
  stats: [
    { value: '26+', label: 'Years of Excellence' },
    { value: '12', label: 'Branches Worldwide' },
    { value: '100+', label: 'Partnered Universities' },
    { value: '15+', label: 'Countries to Choose From' },
    { value: '98%', label: 'Visa Success Rate' },
    { value: '10K+', label: 'Success Stories' },
  ],
  servicesSubtitle: 'What We Offer',
  servicesHeading: 'Comprehensive Guidance For Your Journey',
  servicesParagraph: 'We support you at every step of your abroad journey, from choosing a course to landing in your dream country',
  services: [
    { title: 'Career Counseling', description: 'Aligning your study path with long-term career aspirations and global market trends.' },
    { title: 'University Selection', description: 'Finding the perfect match for your academic goals based on your profile and preferences.' },
    { title: 'Documentation Assistance', description: 'Expert help with documentation, interview preparation, and filing to ensure success.' },
    { title: 'Test Preparation', description: 'Comprehensive coaching for IELTS.' },
    { title: 'Interview Preparation', description: 'Personalized coaching to excel in university and embassy interviews.' },
    { title: 'Scholarship Guidance', description: 'Identifying and applying for financial aid and scholarships to fund your education.' },
    { title: 'Pre-Departure Briefing', description: 'Comprehensive guidance on accommodation, travel, insurance, and cultural adaptation.' },
    { title: 'Post-Departure Assistance', description: 'Continuous support and resources after your arrival to help you settle in and thrive.' },
  ],
  howItWorksHeading: 'How It Works',
  howItWorksSubtitle: 'Your journey to international education in 4 simple steps.',
  howItWorksSteps: [
    { title: 'Profile Assessment', description: 'We evaluate your academic background and interests to chart your path.' },
    { title: 'University Selection', description: 'Select from top-ranked universities that match your profile.' },
    { title: 'Application Filing', description: 'We handle the paperwork ensuring error-free application submission.' },
    { title: 'Visa & Departure', description: 'Get your visa approved and fly to your dream destination.' },
  ],
  studyDestinationsHeading: 'Study Destinations',
  studyDestinationsSubheading: 'Explore opportunities in top educational hubs worldwide',
  studyDestinations: [
    { name: 'United Kingdom', imageUrl: '' },
    { name: 'Canada', imageUrl: '' },
    { name: 'Australia', imageUrl: '' },
    { name: 'The United States', imageUrl: '' },
    { name: 'Europe', imageUrl: '' },
    { name: 'Uzbekistan', imageUrl: '' },
    { name: 'UAE', imageUrl: '' },
    { name: 'China', imageUrl: '' },
    { name: 'India', imageUrl: '' },
    { name: 'Bangladesh', imageUrl: '' },
  ],
  universityLogosRow1: [],
  universityLogosRow2: [],
};

export default function AdminHomepage() {
  const navigate = useNavigate();
  const [homeContent, setHomeContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSuccess, setContentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(null);

  useEffect(() => {
    if (!getAdminToken()) {
      navigate('/admin/login', { replace: true });
      return;
    }
    setContentLoading(true);
    contentApi.getHome()
      .then((data) => setHomeContent({
        stats: data.stats?.length === 6 ? data.stats : DEFAULT_HOME_CONTENT.stats,
        servicesSubtitle: data.servicesSubtitle ?? DEFAULT_HOME_CONTENT.servicesSubtitle,
        servicesHeading: data.servicesHeading ?? DEFAULT_HOME_CONTENT.servicesHeading,
        servicesParagraph: data.servicesParagraph ?? DEFAULT_HOME_CONTENT.servicesParagraph,
        services: Array.isArray(data.services) && data.services.length ? data.services : DEFAULT_HOME_CONTENT.services,
        howItWorksHeading: data.howItWorksHeading ?? DEFAULT_HOME_CONTENT.howItWorksHeading,
        howItWorksSubtitle: data.howItWorksSubtitle ?? DEFAULT_HOME_CONTENT.howItWorksSubtitle,
        howItWorksSteps: Array.isArray(data.howItWorksSteps) && data.howItWorksSteps.length ? data.howItWorksSteps : DEFAULT_HOME_CONTENT.howItWorksSteps,
        studyDestinationsHeading: data.studyDestinationsHeading ?? DEFAULT_HOME_CONTENT.studyDestinationsHeading,
        studyDestinationsSubheading: data.studyDestinationsSubheading ?? DEFAULT_HOME_CONTENT.studyDestinationsSubheading,
        studyDestinations: Array.isArray(data.studyDestinations) && data.studyDestinations.length ? data.studyDestinations.map((d) => ({ name: d.name || '', imageUrl: d.imageUrl || '' })) : DEFAULT_HOME_CONTENT.studyDestinations,
        universityLogosRow1: Array.isArray(data.universityLogosRow1) ? data.universityLogosRow1.map((d) => ({ name: d.name || '', imageUrl: d.imageUrl || '' })) : DEFAULT_HOME_CONTENT.universityLogosRow1,
        universityLogosRow2: Array.isArray(data.universityLogosRow2) ? data.universityLogosRow2.map((d) => ({ name: d.name || '', imageUrl: d.imageUrl || '' })) : DEFAULT_HOME_CONTENT.universityLogosRow2,
      }))
      .catch(() => setHomeContent(DEFAULT_HOME_CONTENT))
      .finally(() => setContentLoading(false));
  }, [navigate]);

  const handleSaveHomeContent = async (e) => {
    e.preventDefault();
    if (!homeContent) return;
    setContentSaving(true);
    setError('');
    setContentSuccess(false);
    try {
      const payload = {
        ...homeContent,
        studyDestinations: (homeContent.studyDestinations || []).map((d) => ({
          name: d?.name ?? '',
          imageUrl: (d?.imageUrl != null && d?.imageUrl !== '') ? String(d.imageUrl).trim() : '',
        })),
        universityLogosRow1: (homeContent.universityLogosRow1 || []).map((d) => ({
          name: d?.name ?? '',
          imageUrl: (d?.imageUrl != null && d?.imageUrl !== '') ? String(d.imageUrl).trim() : '',
        })),
        universityLogosRow2: (homeContent.universityLogosRow2 || []).map((d) => ({
          name: d?.name ?? '',
          imageUrl: (d?.imageUrl != null && d?.imageUrl !== '') ? String(d.imageUrl).trim() : '',
        })),
      };
      await adminApi.updateHomeContent(payload);
      setContentSuccess(true);
      setTimeout(() => setContentSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save homepage content.');
    } finally {
      setContentSaving(false);
    }
  };

  const addService = () => setHomeContent((prev) => ({ ...prev, services: [...(prev.services || []), { title: '', description: '' }] }));
  const deleteService = (i) => setHomeContent((prev) => ({ ...prev, services: prev.services.filter((_, j) => j !== i) }));
  const addStep = () => setHomeContent((prev) => ({ ...prev, howItWorksSteps: [...(prev.howItWorksSteps || []), { title: '', description: '' }] }));
  const deleteStep = (i) => setHomeContent((prev) => ({ ...prev, howItWorksSteps: prev.howItWorksSteps.filter((_, j) => j !== i) }));
  const addDestination = () => setHomeContent((prev) => ({ ...prev, studyDestinations: [...(prev.studyDestinations || []), { name: '', imageUrl: '' }] }));
  const deleteDestination = (i) => setHomeContent((prev) => ({ ...prev, studyDestinations: prev.studyDestinations.filter((_, j) => j !== i) }));

  const handleDestinationImageUpload = async (index, file) => {
    if (!file) return;
    setUploadingImage(index);
    setError('');
    try {
      const { url } = await adminApi.uploadImage(file);
      const imageUrl = url && (url.startsWith('/') || url.startsWith('http')) ? url : `/${url}`;
      setHomeContent((prev) => ({
        ...prev,
        studyDestinations: prev.studyDestinations.map((d, j) => (j === index ? { ...d, imageUrl } : d)),
      }));
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(null);
    }
  };

  const addLogoItem = (rowKey) => setHomeContent((prev) => ({
    ...prev,
    [rowKey]: [...(prev[rowKey] || []), { name: '', imageUrl: '' }],
  }));
  const deleteLogoItem = (rowKey, i) => setHomeContent((prev) => ({
    ...prev,
    [rowKey]: (prev[rowKey] || []).filter((_, j) => j !== i),
  }));
  const handleLogoImageUpload = async (rowKey, index, file) => {
    if (!file) return;
    setUploadingImage(`${rowKey}-${index}`);
    setError('');
    try {
      const { url } = await adminApi.uploadImage(file);
      const imageUrl = url && (url.startsWith('/') || url.startsWith('http')) ? url : `/${url}`;
      setHomeContent((prev) => ({
        ...prev,
        [rowKey]: (prev[rowKey] || []).map((d, j) => (j === index ? { ...d, imageUrl } : d)),
      }));
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Homepage content</h1>
        <p className="text-gray-500 text-sm sm:text-base">Edit stats, services, how it works, study destinations and university logos.</p>
      </div>
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-start gap-3">
          <span className="text-red-500 mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}
      {contentLoading ? (
        <div className="admin-card p-8 text-center">
          <div className="inline-block w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin mb-3" />
          <p className="text-gray-500 text-sm">Loading content...</p>
        </div>
      ) : homeContent ? (
        <form onSubmit={handleSaveHomeContent} className="space-y-6">
          <div className="admin-card p-5 sm:p-6">
            <h3 className="admin-section-title mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-secondary rounded-full" />
              Stats bar (6 items)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {homeContent.stats.map((stat, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => setHomeContent((prev) => ({
                      ...prev,
                      stats: prev.stats.map((s, j) => j === i ? { ...s, value: e.target.value.replace(/[<>]/g, '').slice(0, 50) } : s),
                    }))}
                    placeholder="Value"
                    maxLength={50}
                    className="admin-input flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => setHomeContent((prev) => ({
                      ...prev,
                      stats: prev.stats.map((s, j) => j === i ? { ...s, label: e.target.value.replace(/[<>]/g, '').slice(0, 100) } : s),
                    }))}
                    placeholder="Label"
                    maxLength={100}
                    className="admin-input flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card p-5 sm:p-6">
            <h3 className="admin-section-title mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-secondary rounded-full" />
              What We Offer
            </h3>
            <div className="space-y-3 mb-4">
              <input
                type="text"
                value={homeContent.servicesSubtitle}
                onChange={(e) => setHomeContent((prev) => ({ ...prev, servicesSubtitle: e.target.value.replace(/[<>]/g, '').slice(0, 100) }))}
                placeholder="Subtitle (e.g. What We Offer)"
                maxLength={100}
                className="admin-input w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
              <input
                type="text"
                value={homeContent.servicesHeading}
                onChange={(e) => setHomeContent((prev) => ({ ...prev, servicesHeading: e.target.value.replace(/[<>]/g, '').slice(0, 200) }))}
                placeholder="Main heading"
                maxLength={200}
                className="admin-input w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
              <textarea
                value={homeContent.servicesParagraph}
                onChange={(e) => setHomeContent((prev) => ({ ...prev, servicesParagraph: e.target.value.replace(/[<>]/g, '').slice(0, 500) }))}
                placeholder="Paragraph"
                maxLength={500}
                rows={2}
                className="admin-input w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none"
              />
            </div>
            <div className="space-y-3">
              {homeContent.services.map((svc, i) => (
                <div key={i} className="border-t border-gray-100 pt-3 first:border-t-0 first:pt-0 flex gap-2">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={svc.title}
                      onChange={(e) => setHomeContent((prev) => ({
                        ...prev,
                        services: prev.services.map((s, j) => j === i ? { ...s, title: e.target.value.replace(/[<>]/g, '').slice(0, 150) } : s),
                      }))}
                      placeholder={`Service ${i + 1} title`}
                      maxLength={150}
                      className="admin-input w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none mb-1"
                    />
                    <textarea
                      value={svc.description}
                      onChange={(e) => setHomeContent((prev) => ({
                        ...prev,
                        services: prev.services.map((s, j) => j === i ? { ...s, description: e.target.value.replace(/[<>]/g, '').slice(0, 500) } : s),
                      }))}
                      placeholder="Description"
                      maxLength={500}
                      rows={2}
                      className="admin-input w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none"
                    />
                  </div>
                  <button type="button" onClick={() => deleteService(i)} className="self-start mt-1 px-3 py-1.5 text-red-600 text-xs font-medium hover:bg-red-50 rounded-lg transition-colors">Delete</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addService} className="mt-3 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">+ Add service</button>
          </div>

          <div className="admin-card p-5 sm:p-6">
            <h3 className="admin-section-title mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-secondary rounded-full" />
              How It Works
            </h3>
            <div className="space-y-3 mb-4">
              <input
                type="text"
                value={homeContent.howItWorksHeading}
                onChange={(e) => setHomeContent((prev) => ({ ...prev, howItWorksHeading: e.target.value.replace(/[<>]/g, '').slice(0, 100) }))}
                placeholder="Heading"
                maxLength={100}
                className="admin-input w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
              <input
                type="text"
                value={homeContent.howItWorksSubtitle}
                onChange={(e) => setHomeContent((prev) => ({ ...prev, howItWorksSubtitle: e.target.value.replace(/[<>]/g, '').slice(0, 200) }))}
                placeholder="Subtitle"
                maxLength={200}
                className="admin-input w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-3">
              {homeContent.howItWorksSteps.map((step, i) => (
                <div key={i} className="border-t border-gray-100 pt-3 flex gap-2">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => setHomeContent((prev) => ({
                        ...prev,
                        howItWorksSteps: prev.howItWorksSteps.map((s, j) => j === i ? { ...s, title: e.target.value.replace(/[<>]/g, '').slice(0, 150) } : s),
                      }))}
                      placeholder={`Step ${i + 1} title`}
                      maxLength={150}
                      className="admin-input w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm mb-1 focus:outline-none"
                    />
                    <textarea
                      value={step.description}
                      onChange={(e) => setHomeContent((prev) => ({
                        ...prev,
                        howItWorksSteps: prev.howItWorksSteps.map((s, j) => j === i ? { ...s, description: e.target.value.replace(/[<>]/g, '').slice(0, 400) } : s),
                      }))}
                      placeholder="Description"
                      maxLength={400}
                      rows={2}
                      className="admin-input w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none"
                    />
                  </div>
                  <button type="button" onClick={() => deleteStep(i)} className="self-start mt-1 px-3 py-1.5 text-red-600 text-xs font-medium hover:bg-red-50 rounded-lg transition-colors">Delete</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addStep} className="mt-3 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">+ Add step</button>
          </div>

          <div className="admin-card p-5 sm:p-6">
            <h3 className="admin-section-title mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-secondary rounded-full" />
              Study Destinations
            </h3>
            <div className="space-y-3 mb-4">
              <input
                type="text"
                value={homeContent.studyDestinationsHeading}
                onChange={(e) => setHomeContent((prev) => ({ ...prev, studyDestinationsHeading: e.target.value.replace(/[<>]/g, '').slice(0, 100) }))}
                placeholder="Heading"
                maxLength={100}
                className="admin-input w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
              <input
                type="text"
                value={homeContent.studyDestinationsSubheading}
                onChange={(e) => setHomeContent((prev) => ({ ...prev, studyDestinationsSubheading: e.target.value.replace(/[<>]/g, '').slice(0, 200) }))}
                placeholder="Subheading"
                maxLength={200}
                className="admin-input w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-3">
              {homeContent.studyDestinations.map((dest, i) => (
                <div key={i} className="flex flex-wrap gap-2 items-start border-b border-gray-100 pb-3">
                  <input
                    type="text"
                    value={dest.name}
                    onChange={(e) => setHomeContent((prev) => ({
                      ...prev,
                      studyDestinations: prev.studyDestinations.map((d, j) => j === i ? { ...d, name: e.target.value.replace(/[<>]/g, '').slice(0, 100) } : d),
                    }))}
                    placeholder="Country name"
                    maxLength={100}
                    className="admin-input flex-1 min-w-[120px] px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {uploadingImage === i ? 'Uploading…' : dest.imageUrl ? 'Change image' : 'Add image'}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      disabled={uploadingImage !== null}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDestinationImageUpload(i, file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <button type="button" onClick={() => deleteDestination(i)} className="px-3 py-1.5 text-red-600 text-xs font-medium hover:bg-red-50 rounded-lg transition-colors">Delete</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addDestination} className="mt-3 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">+ Add country</button>
          </div>

          <div className="admin-card p-5 sm:p-6">
            <h3 className="admin-section-title mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-secondary rounded-full" />
              University logos (two marquee rows)
            </h3>
            <p className="text-gray-500 text-sm mb-4">Row 1 scrolls left→right, Row 2 scrolls right→left. Add items and upload an image for each.</p>
            {['universityLogosRow1', 'universityLogosRow2'].map((rowKey) => (
              <div key={rowKey} className="mb-6 last:mb-0">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{rowKey === 'universityLogosRow1' ? 'Row 1 (left → right)' : 'Row 2 (right → left)'}</h4>
                <div className="space-y-2">
                  {(homeContent[rowKey] || []).map((item, i) => (
                    <div key={i} className="flex flex-wrap gap-2 items-center border-b border-gray-100 pb-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => setHomeContent((prev) => ({
                          ...prev,
                          [rowKey]: (prev[rowKey] || []).map((d, j) => j === i ? { ...d, name: e.target.value.replace(/[<>]/g, '').slice(0, 150) } : d),
                        }))}
                        placeholder="Name (optional)"
                        maxLength={150}
                        className="admin-input flex-1 min-w-[100px] px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {uploadingImage === `${rowKey}-${i}` ? 'Uploading…' : item.imageUrl ? 'Change image' : 'Add image'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          className="hidden"
                          disabled={uploadingImage !== null}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleLogoImageUpload(rowKey, i, file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <button type="button" onClick={() => deleteLogoItem(rowKey, i)} className="px-3 py-1.5 text-red-600 text-xs font-medium hover:bg-red-50 rounded-lg transition-colors">Delete</button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addLogoItem(rowKey)} className="mt-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">+ Add to this row</button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={contentSaving}
              className="px-6 py-3 rounded-xl bg-secondary text-white text-sm font-semibold shadow-md shadow-secondary/20 hover:shadow-lg hover:bg-secondary-dark disabled:opacity-70 transition-all"
            >
              {contentSaving ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin align-middle mr-2" />
                  Saving...
                </>
              ) : (
                'Save homepage content'
              )}
            </button>
            {contentSuccess && (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Saved.
              </span>
            )}
          </div>
        </form>
      ) : null}
    </div>
  );
}

'use client'

import { MapPin, DollarSign } from 'lucide-react'

const jobs = [
  {
    id: 1,
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'Bangalore, Karnataka',
    salary: '₹18L - 24L',
    description: 'Lead the development of our recipe platform using Next.js and Node.js.',
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'Mumbai, Maharashtra',
    salary: '₹15L - 20L',
    description: 'Shape the future of Dishly by defining product strategy and roadmap.',
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remote (India)',
    salary: '₹12L - 16L',
    description: 'Create beautiful and intuitive user experiences for millions of food lovers.',
  },
  {
    id: 4,
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Bangalore, Karnataka',
    salary: '₹14L - 18L',
    description: 'Build scalable APIs and databases that power Dishly.',
  },
  {
    id: 5,
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Delhi, NCR',
    salary: '₹10L - 14L',
    description: 'Drive growth and engagement for the Dishly community across India.',
  },
  {
    id: 6,
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Remote (India)',
    salary: '₹12L - 15L',
    description: 'Analyze user behavior and trends to improve our platform.',
  },
  {
    id: 7,
    title: 'Content Creator (Food Blogger)',
    department: 'Content',
    location: 'Remote (India)',
    salary: '₹8L - 12L',
    description: 'Create engaging Indian and fusion recipes for our community.',
  },
  {
    id: 8,
    title: 'Customer Support Lead',
    department: 'Support',
    location: 'Remote (India)',
    salary: '₹9L - 12L',
    description: 'Lead our customer support team and ensure excellent user experience.',
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-dishly-primary/10 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Join Our Team</h1>
          <p className="text-xl text-gray-600 mb-8">
            Help us build the future of recipe sharing. We&apos;re looking for passionate people to join our growing team.
          </p>
          <p className="text-lg text-gray-600">
            We offer competitive salaries, flexible work arrangements, and a great team culture.
          </p>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Open Positions</h2>

        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow hover:border-dishly-primary"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.department}</p>
                </div>
                <span className="inline-block px-3 py-1 bg-dishly-primary/10 text-dishly-primary rounded-full text-sm font-semibold">
                  Hiring
                </span>
              </div>

              <p className="text-gray-600 mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-6 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-dishly-primary" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-dishly-primary" />
                  {job.salary}
                </div>
              </div>

              <button className="px-6 py-2 bg-dishly-primary text-white rounded-lg hover:bg-dishly-primary/90 transition-colors font-medium">
                Apply Now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-20 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Work at Dishly?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gradient-to-br from-dishly-primary/10 to-dishly-accent/10 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Competitive Salaries</h3>
              <p className="text-gray-600">Competitive compensation matching industry standards in India.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-dishly-primary/10 to-dishly-accent/10 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Remote Work</h3>
              <p className="text-gray-600">Work from anywhere in India with flexible schedules.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-dishly-primary/10 to-dishly-accent/10 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Health Benefits</h3>
              <p className="text-gray-600">Comprehensive health insurance and wellness programs.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-dishly-primary/10 to-dishly-accent/10 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Career Growth</h3>
              <p className="text-gray-600">Opportunities to learn and advance in India&apos;s tech ecosystem.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-dishly-primary/10 to-dishly-accent/10 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Team Culture</h3>
              <p className="text-gray-600">Work with passionate people who love food and technology.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-dishly-primary/10 to-dishly-accent/10 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Work-Life Balance</h3>
              <p className="text-gray-600">Generous PTO, flexible hours, and supportive management.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

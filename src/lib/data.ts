import type { Citizen, Employee, Department, Section, Service, LogEntry } from './types'

export const citizens: Citizen[] = [
  { id: 1, name: 'Ahmed Ali',    idNum: '123456789', status: 'Active'   },
  { id: 2, name: 'Saraa Ali',    idNum: '987456321', status: 'pending'  },
  { id: 3, name: 'Omar Sami',    idNum: '987456321', status: 'Active'   },
  { id: 4, name: 'Nader Salah',  idNum: '954781231', status: 'Active'   },
  { id: 5, name: 'Aya Abd',      idNum: '987456321', status: 'pending'  },
]

export const employees: Employee[] = [
  { id: 1,  name: 'Ahmed Ali',       section: 'Water',      status: 'Active',   tasks: 5 },
  { id: 2,  name: 'Saraa Ali',       section: 'Water',      status: 'Inactive', tasks: 3 },
  { id: 3,  name: 'Omar Sami',       section: 'Licenses',   status: 'Active',   tasks: 2 },
  { id: 4,  name: 'Nader Salah',     section: 'Licenses',   status: 'Active',   tasks: 4 },
  { id: 5,  name: 'Aya Abd',         section: 'Complaints', status: 'Active',   tasks: 2 },
  { id: 6,  name: 'Mahmoud Ahmed',   section: 'Damages',    status: 'Active',   tasks: 3 },
  { id: 7,  name: 'Suleiman Abd',    section: 'Invoices',   status: 'Inactive', tasks: 0 },
  { id: 8,  name: 'Khaled Khalil',   section: 'Invoices',   status: 'Active',   tasks: 1 },
  { id: 9,  name: 'Muhammad Raafat', section: 'Licenses',   status: 'Inactive', tasks: 2 },
  { id: 10, name: 'Abdullah Ahmed',  section: 'Damages',    status: 'Active',   tasks: 4 },
]

export const departments: Department[] = [
  { id: 1, name: 'Water services', desc: 'Responsible for water services', sections: 1 },
  { id: 2, name: 'Documents',       desc: 'Responsible for clearance',      sections: 1 },
  { id: 3, name: 'License',         desc: 'Responsible for licenses',       sections: 1 },
  { id: 4, name: 'Sanitation',      desc: 'Responsible for sanitation',     sections: 1 },
]

export const sections: Section[] = [
  { id: 1, name: 'Installations section', dept: 'Water Department', employees: 20 },
  { id: 2, name: 'Maintenance Section',   dept: 'Water Department', employees: 10 },
  { id: 3, name: 'Readings section',      dept: 'Water Department', employees: 7  },
  { id: 4, name: 'Billing Section',       dept: 'Water Department', employees: 5  },
]

export const services: Service[] = [
  { id: 1, name: 'Water subscription', dept: 'Water Department',      date: '15\\5\\2024' },
  { id: 2, name: 'Documents',          dept: 'Documents Department',  date: '15\\5\\2024' },
  { id: 3, name: 'License',            dept: 'Licenses Department',   date: '15\\5\\2024' },
  { id: 4, name: 'Sanitation',         dept: 'Sanitation Department', date: '15\\5\\2024' },
]

export const logs: LogEntry[] = [
  { id: 1, datetime: '20-11-2024 | 10:15AM',  user: 'General Manager', proc: 'Login',           result: 'successful' },
  { id: 2, datetime: '21-11-2024 | 11:10 AM', user: 'General Manager', proc: 'Add an employee', result: 'successful' },
  { id: 3, datetime: '15-11-2024 | 9:10 AM',  user: 'Sarah Ali',       proc: 'Service request', result: 'to fail'    },
  { id: 4, datetime: '15-11-2024 | 9:40 AM',  user: 'General Manager', proc: 'Modify service',  result: 'successful' },
  { id: 5, datetime: '10-11-2024 | 10:45 AM', user: 'System',          proc: 'System update',   result: 'successful' },
]

export const latestRequests = [
  { num: 1, id: 'REQ-001', citizen: 'Ahmed Muhammad', service: 'Building permit',     status: 'In process' },
  { num: 2, id: 'REQ-002', citizen: 'Omar Sami',      service: 'Water subscription',  status: 'Complete'   },
  { num: 3, id: 'REQ-002', citizen: 'Sara Ali',        service: 'Sanitation',          status: 'Rejected'   },
]

export const awaitingVerification = [
  { name: 'Ahmed Murtaja', idNum: '123456789', date: '15\\5\\2025' },
  { name: 'Nour Shaat',    idNum: '987456321', date: '10\\5\\2025' },
]

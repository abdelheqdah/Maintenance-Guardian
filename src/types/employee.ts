export interface EmployeeCertificate {
  id: string;
  name: string;
  number: string;
  issueDate?: string;
  expiryDate: string;
  issuingBody?: string;
  notes?: string;
}

export interface Employee {
  id: string;
  companyId: string;
  name: string;
  employeeId: string;
  position: string;
  department?: string;
  
  // Primary certificate info for V1
  certificateName: string;
  certificateNumber: string;
  issueDate?: string;
  expiryDate: string;
  
  // Support for multiple certificates
  certificates?: EmployeeCertificate[];
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

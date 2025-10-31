export interface FirestoreUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt?: FirebaseFirestore.Timestamp | Date;
  updatedAt?: FirebaseFirestore.Timestamp | Date;
}

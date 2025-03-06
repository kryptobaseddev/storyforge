import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../utils/errorHandler';
import { useToast } from '../../hooks/useToast';
import { useAuthService } from '../../hooks/useAuthService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const auth = useAuthService();
  
  // Use the forgotPassword mutation from auth service
  const forgotPasswordMutation = auth.forgotPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email.");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Check Your Email</h1>
            <p className="text-muted-foreground">
              We've sent password reset instructions to {email}
            </p>
          </div>
          <div className="rounded-md bg-primary/10 p-4">
            <p className="text-sm text-primary">
              Please check your email inbox and follow the instructions to reset your password. The link will expire in 30 minutes.
            </p>
          </div>
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your email to receive password reset instructions
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>
        
        <div className="text-center text-sm">
          <Link
            to="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 
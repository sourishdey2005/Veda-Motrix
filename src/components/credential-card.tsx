import { Info } from 'lucide-react';

export function DemoCredentialCard() {
  return (
    <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-white/10 max-w-sm">
      <div className="flex items-center gap-3 mb-2">
        <Info className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Demo Credentials</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Use these credentials to explore different roles.
      </p>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground">Manager Role</h4>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">Email:</span> manager@vedamotrix.ai
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">Password:</span> VEDA@123
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">Service Center Role</h4>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">Email:</span> service@vedamotrix.ai
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">Password:</span> SERVICE@123
          </p>
        </div>
      </div>
    </div>
  );
}

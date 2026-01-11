import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(128),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Check if user is admin
        checkAdminAndRedirect(session.user.id);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkAdminAndRedirect(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminAndRedirect = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (data?.role === "admin") {
      navigate("/admin");
    } else {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const schema = isLogin ? loginSchema : signupSchema;
      const validated = schema.parse(formData);

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: validated.email,
          password: validated.password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Login Failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        }
      } else {
        const allowedEmails = [
          "ceo@engineerstechbd.com",
          "admin@engineerstechbd.com",
          "info@engineerstechbd.com",
        ];

        if (!allowedEmails.includes(validated.email.toLowerCase())) {
          toast({
            title: "Registration Restricted",
            description: "Only authorized email addresses can register as admin.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: validated.email,
          password: validated.password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: {
              full_name: (validated as z.infer<typeof signupSchema>).fullName,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Please login instead.",
              variant: "destructive",
            });
            setIsLogin(true);
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Account Created",
            description: "You can now login with your credentials.",
          });
          setIsLogin(true);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-30" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Auth Card */}
        <div className="bg-gradient-card rounded-2xl border border-border/50 p-8 md:p-10 animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-3xl">e</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? "Admin Login" : "Create Account"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin
                ? "Sign in to access the admin dashboard"
                : "Register with your authorized email"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Full Name
                </label>
                <Input
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-secondary border-border"
                />
                {errors.fullName && (
                  <p className="text-destructive text-xs mt-1">{errors.fullName}</p>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="admin@engineerstechbd.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-secondary border-border pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-secondary border-border pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-primary hover:underline ml-1 font-medium"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Allowed Emails Info */}
          {!isLogin && (
            <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                Only authorized emails can register:
                <br />
                <span className="text-primary">ceo@</span>, <span className="text-primary">admin@</span>, <span className="text-primary">info@</span>engineerstechbd.com
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

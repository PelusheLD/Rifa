import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type PageConfig = {
  logoUrl: string;
  title: string;
  subtitle: string;
  heroImageUrl: string;
  highlight1: string;
  highlight2: string;
  highlight3: string;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  footerLogoUrl: string;
  footerCompanyName: string;
  footerDescription: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    whatsapp: string;
  };
};

export default function PageConfigForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<PageConfig>({
    logoUrl: "",
    title: "",
    subtitle: "",
    heroImageUrl: "",
    highlight1: "",
    highlight2: "",
    highlight3: "",
    socials: {
      facebook: "",
      instagram: "",
      twitter: ""
    },
    footerLogoUrl: "",
    footerCompanyName: "",
    footerDescription: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      whatsapp: ""
    }
  });

  useEffect(() => {
    async function fetchConfig() {
      setLoading(true);
      try {
        const data = await apiRequest("/api/page-config") as PageConfig;
        setConfig({
          ...data,
          socialLinks: {
            facebook: data.socialLinks?.facebook || "",
            instagram: data.socialLinks?.instagram || "",
            twitter: data.socialLinks?.twitter || "",
            whatsapp: data.socialLinks?.whatsapp || ""
          },
          socials: {
            facebook: data.socials?.facebook || "",
            instagram: data.socials?.instagram || "",
            twitter: data.socials?.twitter || ""
          }
        });
      } catch (e) {
        toast({ title: "Error", description: "No se pudo cargar la configuración", variant: "destructive" });
      }
      setLoading(false);
    }
    fetchConfig();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.startsWith("socials.")) {
      const key = name.split(".")[1];
      setConfig((prev) => ({ ...prev, socials: { ...prev.socials, [key]: value } }));
    } else if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setConfig((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
    } else {
      setConfig((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/api/page-config", {
        method: "PUT",
        body: JSON.stringify(config),
        headers: { "Content-Type": "application/json" }
      });
      toast({ title: "Guardado", description: "Configuración actualizada correctamente" });
    } catch (e) {
      toast({ title: "Error", description: "No se pudo guardar la configuración", variant: "destructive" });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-12">Cargando configuración...</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Configurar Página Principal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Configuración General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL del Logo</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  value={config.logoUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Título Principal</Label>
                <Input
                  id="title"
                  name="title"
                  value={config.title}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Textarea
                  id="subtitle"
                  name="subtitle"
                  value={config.subtitle}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="heroImageUrl">URL de la Imagen Principal</Label>
                <Input
                  id="heroImageUrl"
                  name="heroImageUrl"
                  value={config.heroImageUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="highlight1">Destacado 1</Label>
                <Input
                  id="highlight1"
                  name="highlight1"
                  value={config.highlight1}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="highlight2">Destacado 2</Label>
                <Input
                  id="highlight2"
                  name="highlight2"
                  value={config.highlight2}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="highlight3">Destacado 3</Label>
                <Input
                  id="highlight3"
                  name="highlight3"
                  value={config.highlight3}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Configuración del Footer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="footerLogoUrl">URL del Logo del Footer</Label>
                <Input
                  id="footerLogoUrl"
                  name="footerLogoUrl"
                  value={config.footerLogoUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerCompanyName">Nombre de la Empresa</Label>
                <Input
                  id="footerCompanyName"
                  name="footerCompanyName"
                  value={config.footerCompanyName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="footerDescription">Descripción del Footer</Label>
                <Textarea
                  id="footerDescription"
                  name="footerDescription"
                  value={config.footerDescription}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Redes Sociales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  name="socialLinks.facebook"
                  value={config.socialLinks.facebook}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="socialLinks.instagram"
                  value={config.socialLinks.instagram}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="socialLinks.twitter"
                  value={config.socialLinks.twitter}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (WS)</Label>
                <Input
                  id="whatsapp"
                  name="socialLinks.whatsapp"
                  value={config.socialLinks.whatsapp}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 
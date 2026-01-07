import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet, Database, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function ExportPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exportar Datos</h1>
        <p className="text-muted-foreground mt-2">
          Descarga tus datos y gestiona tu información
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exportar Datos</CardTitle>
          <CardDescription>
            Descarga tus datos en diferentes formatos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Exportar a CSV</p>
                <p className="text-sm text-muted-foreground">
                  Formato compatible con Excel y Google Sheets
                </p>
              </div>
            </div>
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Exportar a PDF</p>
                <p className="text-sm text-muted-foreground">
                  Reporte completo en formato PDF
                </p>
                <Badge variant="secondary" className="mt-1">Pro</Badge>
              </div>
            </div>
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Exportar todos los datos (JSON)</p>
                <p className="text-sm text-muted-foreground">
                  Backup completo de toda tu información
                </p>
              </div>
            </div>
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </div>

          <div className="rounded-lg bg-muted p-4 text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Próximamente: Sistema de exportación de datos
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
          </div>
          <CardDescription>
            Acciones irreversibles que afectan tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50">
            <div>
              <p className="font-medium">Eliminar mi cuenta</p>
              <p className="text-sm text-muted-foreground">
                Elimina permanentemente tu cuenta y todos tus datos
              </p>
            </div>
            <Button variant="destructive" disabled>
              Eliminar cuenta
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Esta acción es irreversible. Asegúrate de exportar tus datos antes de proceder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

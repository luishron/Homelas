'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogDescription as DialogDescription,
  ResponsiveDialogFooter as DialogFooter,
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
  ResponsiveDialogTrigger as DialogTrigger
} from '@/components/ui/responsive-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Search } from 'lucide-react';
import { saveCategory } from '../actions';
import { useRouter } from 'next/navigation';
import { COLORS } from '@/lib/constants/colors';
import { useToast } from '@/hooks/use-toast';

const ICON_CATEGORIES = {
  comida: {
    name: 'Comida & Bebidas',
    icons: [
      { emoji: '🍔', name: 'hamburguesa' },
      { emoji: '🍕', name: 'pizza' },
      { emoji: '🍝', name: 'pasta' },
      { emoji: '🍜', name: 'ramen' },
      { emoji: '🍱', name: 'bento' },
      { emoji: '🍛', name: 'curry' },
      { emoji: '🍗', name: 'pollo' },
      { emoji: '🥗', name: 'ensalada' },
      { emoji: '🥙', name: 'taco' },
      { emoji: '🌮', name: 'tacos' },
      { emoji: '🌯', name: 'burrito' },
      { emoji: '☕', name: 'cafe' },
      { emoji: '🍺', name: 'cerveza' },
      { emoji: '🍷', name: 'vino' },
      { emoji: '🥤', name: 'refresco' },
      { emoji: '🧃', name: 'jugo' },
    ]
  },
  transporte: {
    name: 'Transporte',
    icons: [
      { emoji: '🚗', name: 'carro auto' },
      { emoji: '🚕', name: 'taxi' },
      { emoji: '🚙', name: 'camioneta' },
      { emoji: '🚌', name: 'autobus' },
      { emoji: '🚎', name: 'transporte publico' },
      { emoji: '🚐', name: 'van' },
      { emoji: '🚓', name: 'policia' },
      { emoji: '🚑', name: 'ambulancia' },
      { emoji: '✈️', name: 'avion vuelo' },
      { emoji: '🚆', name: 'tren' },
      { emoji: '🚲', name: 'bicicleta' },
      { emoji: '🛴', name: 'scooter' },
      { emoji: '⛽', name: 'gasolina' },
      { emoji: '🅿️', name: 'estacionamiento' },
    ]
  },
  hogar: {
    name: 'Hogar & Servicios',
    icons: [
      { emoji: '🏠', name: 'casa hogar' },
      { emoji: '🏡', name: 'casa jardin' },
      { emoji: '🏢', name: 'oficina edificio' },
      { emoji: '🛋️', name: 'sofa muebles' },
      { emoji: '🛏️', name: 'cama' },
      { emoji: '🚿', name: 'ducha bano' },
      { emoji: '🚽', name: 'bano' },
      { emoji: '🔧', name: 'herramienta reparacion' },
      { emoji: '🔨', name: 'martillo construccion' },
      { emoji: '⚡', name: 'electricidad luz' },
      { emoji: '💡', name: 'foco luz' },
      { emoji: '🔌', name: 'enchufe' },
      { emoji: '📺', name: 'television' },
      { emoji: '📞', name: 'telefono' },
      { emoji: '📡', name: 'internet wifi' },
    ]
  },
  entretenimiento: {
    name: 'Entretenimiento',
    icons: [
      { emoji: '🎮', name: 'videojuegos gaming' },
      { emoji: '🎬', name: 'cine peliculas' },
      { emoji: '🎭', name: 'teatro' },
      { emoji: '🎪', name: 'circo' },
      { emoji: '🎨', name: 'arte pintura' },
      { emoji: '🎵', name: 'musica' },
      { emoji: '🎸', name: 'guitarra' },
      { emoji: '🎹', name: 'piano' },
      { emoji: '🎤', name: 'microfono karaoke' },
      { emoji: '🎧', name: 'audifonos' },
      { emoji: '📚', name: 'libros lectura' },
      { emoji: '📖', name: 'libro' },
      { emoji: '🎯', name: 'objetivo meta' },
      { emoji: '🎲', name: 'dados juego' },
      { emoji: '🃏', name: 'cartas poker' },
    ]
  },
  salud: {
    name: 'Salud & Deporte',
    icons: [
      { emoji: '❤️', name: 'corazon salud' },
      { emoji: '💊', name: 'medicina pastilla' },
      { emoji: '💉', name: 'inyeccion vacuna' },
      { emoji: '🏥', name: 'hospital clinica' },
      { emoji: '⚕️', name: 'medico doctor' },
      { emoji: '🩺', name: 'estetoscopio' },
      { emoji: '😷', name: 'cubrebocas' },
      { emoji: '🏋️', name: 'gimnasio pesas' },
      { emoji: '🤸', name: 'ejercicio' },
      { emoji: '🧘', name: 'yoga meditacion' },
      { emoji: '🏃', name: 'correr running' },
      { emoji: '🚴', name: 'ciclismo' },
      { emoji: '🏊', name: 'natacion' },
      { emoji: '⚽', name: 'futbol' },
      { emoji: '🏀', name: 'basketball' },
      { emoji: '🎾', name: 'tenis' },
    ]
  },
  finanzas: {
    name: 'Finanzas & Compras',
    icons: [
      { emoji: '💰', name: 'dinero bolsa' },
      { emoji: '💵', name: 'dolar billete' },
      { emoji: '💳', name: 'tarjeta credito' },
      { emoji: '🏦', name: 'banco' },
      { emoji: '💎', name: 'diamante joya' },
      { emoji: '👔', name: 'corbata ropa formal' },
      { emoji: '👕', name: 'camisa ropa' },
      { emoji: '👗', name: 'vestido' },
      { emoji: '👟', name: 'tenis zapatos' },
      { emoji: '🛍️', name: 'compras shopping' },
      { emoji: '🛒', name: 'carrito supermercado' },
      { emoji: '🎁', name: 'regalo' },
      { emoji: '💍', name: 'anillo' },
      { emoji: '⌚', name: 'reloj' },
    ]
  },
  otros: {
    name: 'Otros',
    icons: [
      { emoji: '📦', name: 'paquete caja' },
      { emoji: '📝', name: 'nota documento' },
      { emoji: '📊', name: 'grafica estadistica' },
      { emoji: '📈', name: 'crecimiento' },
      { emoji: '📉', name: 'decrecimiento' },
      { emoji: '🔔', name: 'campana notificacion' },
      { emoji: '⭐', name: 'estrella favorito' },
      { emoji: '🎓', name: 'graduacion educacion' },
      { emoji: '✏️', name: 'lapiz' },
      { emoji: '📱', name: 'celular telefono' },
      { emoji: '💻', name: 'computadora laptop' },
      { emoji: '🖥️', name: 'monitor pc' },
      { emoji: '⚙️', name: 'configuracion' },
      { emoji: '🔒', name: 'candado seguridad' },
      { emoji: '🌟', name: 'brillo especial' },
    ]
  }
};

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedIcon, setSelectedIcon] = useState('📦');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<keyof typeof ICON_CATEGORIES>('comida');
  const router = useRouter();
  const { toast } = useToast();

  // Filtrar iconos según la búsqueda
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return ICON_CATEGORIES[activeTab].icons;
    }

    const query = searchQuery.toLowerCase().trim();
    const allIcons = Object.values(ICON_CATEGORIES).flatMap(cat => cat.icons);

    return allIcons.filter(icon =>
      icon.name.toLowerCase().includes(query)
    );
  }, [searchQuery, activeTab]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set('color', selectedColor);
    formData.set('icon', selectedIcon);

    const result = await saveCategory(formData);

    if (result?.error) {
      toast({
        title: 'Error al guardar',
        description: result.error,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Categoría creada',
        description: 'La categoría se ha creado exitosamente'
      });
      setOpen(false);
      router.refresh();
      // Reset form
      e.currentTarget.reset();
      setSelectedColor(COLORS[0].value);
      setSelectedIcon('📦');
      setSearchQuery('');
      setActiveTab('comida');
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Categoría</DialogTitle>
          <DialogDescription>
            Crea una categoría para organizar tus gastos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              placeholder="ej. Alimentos"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`h-10 rounded-md border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-foreground scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Icono</Label>

            {/* Buscador de iconos */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar icono... (ej: comida, transporte)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Pestañas de categorías - solo mostrar si no hay búsqueda */}
            {!searchQuery && (
              <div className="flex gap-1 overflow-x-auto pb-2">
                {Object.entries(ICON_CATEGORIES).map(([key, category]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key as keyof typeof ICON_CATEGORIES)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                      activeTab === key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            {/* Grid de iconos con scroll */}
            <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
              <div className="grid grid-cols-8 gap-1">
                {filteredIcons.map((icon) => (
                  <button
                    key={icon.emoji}
                    type="button"
                    onClick={() => setSelectedIcon(icon.emoji)}
                    className={`h-10 rounded-md border-2 text-2xl transition-all hover:scale-110 ${
                      selectedIcon === icon.emoji
                        ? 'border-foreground bg-accent scale-110'
                        : 'border-transparent hover:bg-accent/50'
                    }`}
                    title={icon.name}
                  >
                    {icon.emoji}
                  </button>
                ))}
              </div>
              {filteredIcons.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No se encontraron iconos para &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe esta categoría..."
              rows={3}
            />
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium mb-2">Vista previa:</p>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white"
              style={{ backgroundColor: selectedColor }}
            >
              <span className="text-xl">{selectedIcon}</span>
              <span>Categoría</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Categoría'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CURRENCY_LIST, type CurrencyCode } from '@/lib/config/currencies';

interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
  disabled?: boolean;
}

// Emojis de banderas por país (simplificado)
const FLAG_EMOJIS: Record<CurrencyCode, string> = {
  USD: '🇺🇸',
  MXN: '🇲🇽',
  EUR: '🇪🇸',
  COP: '🇨🇴',
  ARS: '🇦🇷',
  CLP: '🇨🇱',
  PEN: '🇵🇪',
  GTQ: '🇬🇹',
  HNL: '🇭🇳',
  NIO: '🇳🇮',
  CRC: '🇨🇷',
  PAB: '🇵🇦',
  DOP: '🇩🇴',
  CUP: '🇨🇺',
  BOB: '🇧🇴',
  PYG: '🇵🇾',
  UYU: '🇺🇾',
  VES: '🇻🇪',
  BRL: '🇧🇷',
};

export function CurrencySelector({ value, onChange, disabled }: CurrencySelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedCurrency = CURRENCY_LIST.find((c) => c.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Seleccionar moneda"
          className="w-full justify-between h-11"
          disabled={disabled}
        >
          {selectedCurrency ? (
            <span className="flex items-center gap-2">
              <span className="text-lg">{FLAG_EMOJIS[selectedCurrency.code]}</span>
              <span>
                {selectedCurrency.name} ({selectedCurrency.code})
              </span>
            </span>
          ) : (
            'Selecciona tu moneda...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar moneda..." />
          <CommandList>
            <CommandEmpty>No se encontró la moneda.</CommandEmpty>
            <CommandGroup>
              {CURRENCY_LIST.map((currency) => (
                <CommandItem
                  key={currency.code}
                  value={`${currency.name} ${currency.code} ${currency.countries.join(' ')}`}
                  onSelect={() => {
                    onChange(currency.code as CurrencyCode);
                    setOpen(false);
                  }}
                  className="min-h-[44px]"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === currency.code ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="flex items-center gap-2 flex-1">
                    <span className="text-lg">{FLAG_EMOJIS[currency.code as CurrencyCode]}</span>
                    <span className="flex-1">
                      {currency.name} ({currency.code})
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {currency.symbol}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

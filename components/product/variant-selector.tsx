"use client";

import clsx from "clsx";
import { useProduct, useUpdateURL } from "@/components/product/product-context";
import { ProductOption, ProductVariant } from "@/lib/products";
import { Button } from "@radix-ui/themes";
import React from "react";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {}
    ),
  }));

  return options.map((option) => (
    <form key={option.id}>
      <dl className="mb-8">
        <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
        <dd className="grid grid-cols-4 sm:grid-cols-4 gap-3">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();

            // Base option params on current selectedOptions so we can preserve any other param state.
            const optionParams = { ...state, [optionNameLowerCase]: value };

            // Filter out invalid options and check if the option combination is available for sale.
            const filtered = Object.entries(optionParams).filter(
              ([key, value]) =>
                options.find(
                  (option) =>
                    option.name.toLowerCase() === key &&
                    option.values.includes(value)
                )
            );
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) =>
                  combination[key] === value && combination.availableForSale
              )
            );

            // The option is active if it's in the selected options.
            const isActive = state[optionNameLowerCase] === value;

            return (
              <Button
                key={value}
                color={isActive ? "purple" : "gray"}
                variant={isActive ? "solid" : "surface"}
                highContrast={isActive}
                disabled={!isAvailableForSale}
                style={{
                  borderRadius: 9999,
                  minWidth: 48,
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.875rem",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  if (isAvailableForSale) {
                    React.startTransition(() => {
                      const newState = updateOption(optionNameLowerCase, value);
                      updateURL(newState);
                    });
                  }
                }}
                title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
              >
                {value}
              </Button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}

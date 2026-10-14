"use client";

import { useState } from "react";
import { Plus, Trash2, Sparkles, Layers, Sliders, Check, AlertCircle, Image as ImageIcon } from "lucide-react";

export interface VariantItem {
  id?: string;
  name: string;
  modelNumber?: string;
  badge?: string;
  images?: string[];
  variantAttributes: Record<string, string>;
  specifications?: Record<string, string>;
}

interface ProductVariationManagerProps {
  baseProductName: string;
  baseModelNumber: string;
  baseImages: string[];
  variants: VariantItem[];
  onChange: (variants: VariantItem[]) => void;
}

const COMMON_PRESETS = {
  Wattage: ["6W", "9W", "12W", "18W", "24W", "36W", "50W"],
  "Light Color / CCT": ["3000K Warm White", "4000K Natural White", "6500K Cool Daylight"],
  Voltage: ["220-240V AC", "85-265V AC", "12V DC"],
  Finish: ["Matte Black", "Brushed Gold", "Chrome", "Gloss White", "Gunmetal"],
};

const inputCls = "w-full px-3 py-2 bg-[#0a0a0c] text-white border border-white/8 rounded-xl text-xs outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all placeholder:text-white/20";
const labelCls = "block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5";

export default function ProductVariationManager({
  baseProductName,
  baseModelNumber,
  baseImages,
  variants,
  onChange,
}: ProductVariationManagerProps) {
  const [enabled, setEnabled] = useState(variants.length > 0);
  const [attrDimensions, setAttrDimensions] = useState<{ name: string; values: string[] }[]>([
    { name: "Wattage", values: [] },
  ]);
  const [customValueInput, setCustomValueInput] = useState<{ [key: number]: string }>({});

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (!next) {
      onChange([]);
    }
  };

  const addDimension = () => {
    setAttrDimensions([...attrDimensions, { name: "", values: [] }]);
  };

  const removeDimension = (index: number) => {
    setAttrDimensions(attrDimensions.filter((_, i) => i !== index));
  };

  const setDimName = (index: number, name: string) => {
    const copy = [...attrDimensions];
    copy[index].name = name;
    setAttrDimensions(copy);
  };

  const addValueToDim = (index: number, val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    const copy = [...attrDimensions];
    if (!copy[index].values.includes(trimmed)) {
      copy[index].values.push(trimmed);
      setAttrDimensions(copy);
    }
  };

  const removeValueFromDim = (dimIndex: number, valIndex: number) => {
    const copy = [...attrDimensions];
    copy[dimIndex].values = copy[dimIndex].values.filter((_, i) => i !== valIndex);
    setAttrDimensions(copy);
  };

  const generateCombinations = () => {
    const activeDims = attrDimensions.filter(d => d.name.trim() && d.values.length > 0);
    if (activeDims.length === 0) return;

    function cartesian(arr: { name: string; values: string[] }[]): Record<string, string>[] {
      return arr.reduce<Record<string, string>[]>(
        (acc, curr) => {
          return acc.flatMap(comb =>
            curr.values.map(val => ({
              ...comb,
              [curr.name.trim()]: val,
            }))
          );
        },
        [{}]
      );
    }

    const combos = cartesian(activeDims);
    const generated: VariantItem[] = combos.map((attrs, idx) => {
      const attrVals = Object.values(attrs).join(" ");
      const name = baseProductName.trim()
        ? `${baseProductName.trim()} - ${attrVals}`
        : `Variant ${idx + 1} (${attrVals})`;

      // Clean SKU generation
      const skuSuffix = Object.values(attrs)
        .map(v => v.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase())
        .join("-");
      const modelNumber = baseModelNumber.trim()
        ? `${baseModelNumber.trim()}-${skuSuffix}`
        : skuSuffix;

      return {
        name,
        modelNumber,
        variantAttributes: attrs,
        specifications: { ...attrs },
        images: baseImages.filter(Boolean).slice(0, 1),
      };
    });

    onChange(generated);
  };

  const addSingleVariant = () => {
    const newVariant: VariantItem = {
      name: baseProductName.trim() ? `${baseProductName.trim()} - New Variant` : "New Variant",
      modelNumber: baseModelNumber.trim() ? `${baseModelNumber.trim()}-VAR${variants.length + 1}` : `VAR${variants.length + 1}`,
      variantAttributes: { Option: `Option ${variants.length + 1}` },
      specifications: {},
      images: baseImages.filter(Boolean).slice(0, 1),
    };
    onChange([...variants, newVariant]);
  };

  const updateVariant = (index: number, field: keyof VariantItem, value: any) => {
    const copy = [...variants];
    copy[index] = { ...copy[index], [field]: value };
    onChange(copy);
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-6 space-y-6">
      {/* Header with Switch */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <Layers size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Product Variations</h3>
            <p className="text-white/40 text-xs">
              Add multiple wattages, light colors (CCT), or finishes in one go. Each variant will display as its own product in the catalog!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            enabled
              ? "bg-gold text-brand-dark shadow-gold-glow"
              : "bg-white/5 text-white/50 hover:text-white border border-white/10"
          }`}
        >
          {enabled ? <Check size={14} className="stroke-[3]" /> : null}
          {enabled ? "Variations Active" : "Enable Variations"}
        </button>
      </div>

      {enabled && (
        <div className="space-y-6 pt-2 border-t border-white/5">
          {/* Quick Matrix Generator Section */}
          <div className="bg-brand-obsidian/70 rounded-xl p-5 border border-white/8 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-gold" />
                <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                  Fast Variation Generator
                </h4>
              </div>
              <span className="text-[11px] text-white/40">
                Define dimensions (e.g. Wattage, Light Color) to auto-generate all combinations
              </span>
            </div>

            {/* Dimensions */}
            <div className="space-y-4">
              {attrDimensions.map((dim, dimIdx) => (
                <div key={dimIdx} className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={dim.name}
                      onChange={e => setDimName(dimIdx, e.target.value)}
                      placeholder="Dimension Name (e.g. Wattage, Light Color, Finish)"
                      className={`${inputCls} font-semibold`}
                    />
                    {attrDimensions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDimension(dimIdx)}
                        className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove dimension"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Preset chips */}
                  {COMMON_PRESETS[dim.name as keyof typeof COMMON_PRESETS] && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-white/30 mr-1">Quick Add:</span>
                      {COMMON_PRESETS[dim.name as keyof typeof COMMON_PRESETS].map((preset, pIdx) => {
                        const isAdded = dim.values.includes(preset);
                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => (isAdded ? null : addValueToDim(dimIdx, preset))}
                            disabled={isAdded}
                            className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                              isAdded
                                ? "bg-white/5 border-white/5 text-white/20 cursor-default"
                                : "bg-gold/10 hover:bg-gold/20 border-gold/20 text-gold hover:border-gold/40"
                            }`}
                          >
                            + {preset}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Values Chips & Input */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {dim.values.map((v, vIdx) => (
                      <span
                        key={vIdx}
                        className="inline-flex items-center gap-1.5 bg-white/8 hover:bg-white/12 border border-white/10 px-2.5 py-1 rounded-lg text-xs text-white"
                      >
                        <span>{v}</span>
                        <button
                          type="button"
                          onClick={() => removeValueFromDim(dimIdx, vIdx)}
                          className="text-white/40 hover:text-red-400"
                        >
                          &times;
                        </button>
                      </span>
                    ))}

                    <div className="flex gap-2 items-center flex-1 min-w-[200px]">
                      <input
                        type="text"
                        value={customValueInput[dimIdx] || ""}
                        onChange={e => setCustomValueInput({ ...customValueInput, [dimIdx]: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addValueToDim(dimIdx, customValueInput[dimIdx] || "");
                            setCustomValueInput({ ...customValueInput, [dimIdx]: "" });
                          }
                        }}
                        placeholder="Type value (e.g. 12W) and press Enter"
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addValueToDim(dimIdx, customValueInput[dimIdx] || "");
                          setCustomValueInput({ ...customValueInput, [dimIdx]: "" });
                        }}
                        className="px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={addDimension}
                className="flex items-center gap-1.5 text-xs text-gold/80 hover:text-gold font-medium"
              >
                <Plus size={13} /> Add Another Dimension (e.g. Color Temperature)
              </button>

              <button
                type="button"
                onClick={generateCombinations}
                disabled={attrDimensions.every(d => d.values.length === 0)}
                className="flex items-center gap-2 bg-gold hover:bg-gold-600 disabled:opacity-40 text-brand-dark font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-gold-glow"
              >
                <Sparkles size={14} /> Generate Variant Combinations
              </button>
            </div>
          </div>

          {/* Variants Table / Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Configured Variants ({variants.length})
              </h4>
              <button
                type="button"
                onClick={addSingleVariant}
                className="flex items-center gap-1.5 text-xs text-gold hover:text-gold-400 font-semibold"
              >
                <Plus size={13} /> Add Single Variant Manually
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="text-center py-8 bg-black/20 rounded-xl border border-dashed border-white/10">
                <Layers size={28} className="mx-auto text-white/20 mb-2" />
                <p className="text-white/40 text-xs">
                  No variants added yet. Use the Fast Generator above or click &quot;Add Single Variant&quot;.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {variants.map((v, i) => (
                  <div
                    key={i}
                    className="bg-[#121216] border border-white/8 hover:border-gold/30 rounded-xl p-4 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gold/15 text-gold text-[10px] font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-white truncate max-w-md">
                          {v.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="text-red-400/60 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete variant"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls}>Variant Product Name *</label>
                        <input
                          type="text"
                          value={v.name}
                          onChange={e => updateVariant(i, "name", e.target.value)}
                          placeholder="e.g. LED Slim Panel - 12W Warm White"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Model Number / SKU</label>
                        <input
                          type="text"
                          value={v.modelNumber || ""}
                          onChange={e => updateVariant(i, "modelNumber", e.target.value)}
                          placeholder="e.g. OLS-PL-12W-WW"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Badge Label (Optional)</label>
                        <input
                          type="text"
                          value={v.badge || ""}
                          onChange={e => updateVariant(i, "badge", e.target.value)}
                          placeholder="e.g. Best Value, 3000K"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className={labelCls}>Specific Image URL (Optional - defaults to parent image)</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={v.images?.[0] || ""}
                            onChange={e => updateVariant(i, "images", [e.target.value])}
                            placeholder="Paste image link if different from parent"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Attributes (Key: Value)</label>
                        <div className="flex gap-1.5 flex-wrap items-center pt-1">
                          {Object.entries(v.variantAttributes || {}).map(([k, val]) => (
                            <span
                              key={k}
                              className="text-[10px] bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-md font-mono"
                            >
                              {k}: {val}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

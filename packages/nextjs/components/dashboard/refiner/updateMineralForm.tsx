"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Droplet, Thermometer } from "lucide-react";
import { Mineral } from "~~/components/dashboard/refiner/mineralListTable/types";

type UpdateMineralFormProps = {
  mineral?: Mineral;
  onSubmit?: (updatedMineral: Partial<Mineral>) => Promise<void>;
};

export default function UpdateMineralForm({ mineral, onSubmit }: UpdateMineralFormProps) {
  const router = useRouter();
  const [portalOpen, setPortalOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState({
    temperature: "In Celsius",
    storage: "Select Type",
    humidity: "Select Type",
  });
  const [formData, setFormData] = useState<Partial<Mineral>>({
    name: "",
    code: "",
    type: "",
    origin: "",
    weight: 0,
    weightUnit: "KG",
    purity: 0,
    storageConditions: "No Conditions specified",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleQuantityChange = (change: number) => {
    setFormData(prev => ({
      ...prev,
      weight: Math.max(0, (prev.weight || 0) + change),
    }));
  };

  const handlePurityChange = (change: number) => {
    setFormData(prev => ({
      ...prev,
      purity: Math.max(0, Math.min(100, (prev.purity || 0) + change)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      // Navigate back or show success
      router.push("/minerals");
    } catch (error) {
      console.error("Error updating mineral:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Refine Mineral</h1>

        <form onSubmit={handleSubmit} className="border border-[#323539] rounded-xl p-6">
          <div className="mb-6">
            <label className="block mb-2">Mineral-ID</label>
            <div className="relative">
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full bg-[#252525] border border-[#323539] rounded-md py-2 px-3 pr-10 text-white"
                readOnly
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => navigator.clipboard.writeText(formData.code || "")}
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2">Mineral Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#252525] border border-[#323539] rounded-md py-2 px-3 text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-[#252525] border border-[#323539] rounded-md py-2 px-3 text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">Origin</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className="w-full bg-[#252525] border border-[#323539] rounded-md py-2 px-3 text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">Quantity</label>
            <div className="flex items-center">
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full bg-[#252525] border border-[#323539] rounded-md py-2 px-3 text-white"
              />
              <span className="mx-2">KG</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                className="bg-[#252525] border border-[#323539] rounded-md p-2 ml-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                className="bg-[#252525] border border-[#323539] rounded-md p-2 ml-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2">Purity Percentage</label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handlePurityChange(-1)}
                className="bg-[#252525] border border-[#323539] rounded-md p-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </button>
              <div className="flex-1 mx-2">
                <div className="h-2 bg-[#1A1B1E] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${formData.purity || 0}%` }}></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handlePurityChange(1)}
                className="bg-[#252525] border border-[#323539] rounded-md p-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <span className="ml-2">{formData.purity || 0}%</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2">Storage Conditions</label>
            <div
              className="flex items-center justify-between bg-[#1A1B1E] border border-[#323539] rounded-md py-2 px-3 cursor-pointer"
              onClick={() => setPortalOpen(!portalOpen)}
            >
              <span>{formData.storageConditions}</span>
              <button type="button" className="text-white">
                <svg
                  className={`w-5 h-5 transform transition-transform ${portalOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {portalOpen && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
                <div className="bg-[#0D0D0D] border border-gray-700 rounded-xl p-8 w-[400px] relative">
                  <h2 className="text-white text-lg mb-6 font-semibold">Specify Storage Conditions</h2>

                  {/* Temperature */}
                  <div className="mb-4">
                    <label className="block text-white text-sm mb-2">Temperature (°C):</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Enter temperature"
                        value={
                          selectedCondition.temperature === "In Celsius"
                            ? ""
                            : selectedCondition.temperature.replace("°C", "")
                        }
                        onChange={e =>
                          setSelectedCondition(prev => ({
                            ...prev,
                            temperature: e.target.value ? `${e.target.value}°C` : "In Celsius",
                          }))
                        }
                        className="w-full bg-[#252525] border border-[#323539] text-white rounded px-4 py-2 focus:outline-none"
                      />
                      <Thermometer
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                    </div>
                  </div>

                  {/* Storage Type */}
                  <div className="mb-4">
                    <label className="block text-white text-sm mb-2">Storage Type:</label>
                    <select
                      value={selectedCondition.storage}
                      onChange={e => setSelectedCondition(prev => ({ ...prev, storage: e.target.value }))}
                      className="w-full bg-[#252525] border border-[#323539] text-white rounded px-4 py-2 focus:outline-none"
                    >
                      <option value="Select Type">Select Storage Type</option>
                      <option value="Cool & Dry Place">Cool & Dry Place</option>
                      <option value="Room Temperature">Room Temperature</option>
                      <option value="Refrigerated">Refrigerated</option>
                      <option value="Freezer">Freezer</option>
                      <option value="Climate Controlled">Climate Controlled</option>
                    </select>
                  </div>

                  {/* Humidity Range */}
                  <div className="mb-6">
                    <label className="block text-white text-sm mb-2">Humidity Range (%):</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Enter humidity percentage"
                        value={
                          selectedCondition.humidity === "Select Type"
                            ? ""
                            : selectedCondition.humidity.replace("%", "")
                        }
                        onChange={e =>
                          setSelectedCondition(prev => ({
                            ...prev,
                            humidity: e.target.value ? `${e.target.value}%` : "Select Type",
                          }))
                        }
                        className="w-full bg-[#252525] border border-[#323539] text-white rounded px-4 py-2 focus:outline-none"
                      />
                      <Droplet
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setPortalOpen(false)}
                      className="px-4 py-2 text-white bg-[#323539] rounded hover:bg-[#3F4246] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          storageConditions: `Temperature: ${selectedCondition.temperature}, Storage: ${selectedCondition.storage}, Humidity: ${selectedCondition.humidity}`,
                        }));
                        setPortalOpen(false);
                      }}
                      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium transition-colors"
            >
              {loading ? "Refining..." : "Refine Mineral"}
            </button>
            <p className="text-center text-sm text-gray-400 mt-2">Notification will be given to all members</p>
          </div>
        </form>
      </div>
    </div>
  );
}

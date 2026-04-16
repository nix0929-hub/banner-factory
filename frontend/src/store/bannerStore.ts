import { create } from 'zustand'
import type { AppStep, BannerVariant, JobStatus, TextData } from '../types/banner'

interface BannerState {
  // State
  currentStep: AppStep
  referenceImage: File | null
  productImages: File[]
  textData: TextData
  jobId: string | null
  jobStatus: JobStatus | null
  banners: BannerVariant[]
  error: string | null

  // Actions
  setStep: (step: AppStep) => void
  setReferenceImage: (file: File | null) => void
  addProductImage: (file: File) => void
  removeProductImage: (index: number) => void
  updateTextData: (data: Partial<TextData>) => void
  setJobId: (jobId: string | null) => void
  setJobStatus: (status: JobStatus | null) => void
  setBanners: (banners: BannerVariant[]) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialTextData: TextData = {
  headline: '',
  subtext: '',
  cta: '',
  bannerSize: '1200x628',
}

export const useBannerStore = create<BannerState>((set) => ({
  // Initial state
  currentStep: 1,
  referenceImage: null,
  productImages: [],
  textData: initialTextData,
  jobId: null,
  jobStatus: null,
  banners: [],
  error: null,

  // Actions
  setStep: (step) => set({ currentStep: step }),

  setReferenceImage: (file) => set({ referenceImage: file }),

  addProductImage: (file) =>
    set((state) => ({
      productImages: [...state.productImages, file],
    })),

  removeProductImage: (index) =>
    set((state) => ({
      productImages: state.productImages.filter((_, i) => i !== index),
    })),

  updateTextData: (data) =>
    set((state) => ({
      textData: { ...state.textData, ...data },
    })),

  setJobId: (jobId) => set({ jobId }),

  setJobStatus: (status) => set({ jobStatus: status }),

  setBanners: (banners) => set({ banners }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      currentStep: 1,
      referenceImage: null,
      productImages: [],
      textData: initialTextData,
      jobId: null,
      jobStatus: null,
      banners: [],
      error: null,
    }),
}))

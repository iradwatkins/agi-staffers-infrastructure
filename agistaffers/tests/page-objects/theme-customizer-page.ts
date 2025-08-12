import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base-page'

export class ThemeCustomizerPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  // Navigation to customizer
  async openCustomizer(theme: string = 'dawn') {
    await this.goto(`/admin/themes/${theme}/customize`)
    await this.waitForPageLoad()
  }

  // Main customizer elements
  get customizerContainer(): Locator {
    return this.page.locator('.theme-customizer')
  }

  get customizerHeader(): Locator {
    return this.page.locator('.theme-customizer .border-b')
  }

  get previewFrame(): Locator {
    return this.page.locator('.theme-preview iframe, .preview-container')
  }

  get settingsPanel(): Locator {
    return this.page.locator('.theme-customizer .flex-1')
  }

  // Tabs
  get sectionsTab(): Locator {
    return this.page.getByRole('tab', { name: 'Sections' })
  }

  get themeSettingsTab(): Locator {
    return this.page.getByRole('tab', { name: 'Theme Settings' })
  }

  get customCodeTab(): Locator {
    return this.page.getByRole('tab', { name: 'Custom Code' })
  }

  // Preview mode buttons
  get desktopPreviewButton(): Locator {
    return this.page.locator('[data-testid="desktop-preview"]')
  }

  get tabletPreviewButton(): Locator {
    return this.page.locator('[data-testid="tablet-preview"]')
  }

  get mobilePreviewButton(): Locator {
    return this.page.locator('[data-testid="mobile-preview"]')
  }

  // Action buttons
  get undoButton(): Locator {
    return this.page.locator('button:has-text("Undo")')
  }

  get redoButton(): Locator {
    return this.page.locator('button:has-text("Redo")')
  }

  get saveButton(): Locator {
    return this.page.locator('button:has-text("Save")')
  }

  get publishButton(): Locator {
    return this.page.locator('button:has-text("Publish")')
  }

  // Sections management
  get sectionsList(): Locator {
    return this.page.locator('.sections-list, [data-testid="sections-list"]')
  }

  getSectionItem(sectionId: string): Locator {
    return this.page.locator(`[data-section-id="${sectionId}"]`)
  }

  get addSectionButtons(): Locator {
    return this.page.locator('button:has-text("Add"), button:has(svg)')
  }

  getAddSectionButton(sectionType: string): Locator {
    return this.page.locator(`button:has-text("${sectionType}")`)
  }

  // Section controls
  getSectionVisibilityToggle(sectionId: string): Locator {
    return this.getSectionItem(sectionId).locator('button:has(svg[data-icon="eye"]), button:has(svg[data-icon="eye-off"])')
  }

  getSectionMoveUpButton(sectionId: string): Locator {
    return this.getSectionItem(sectionId).locator('button:has(svg[data-icon="chevron-up"])')
  }

  getSectionMoveDownButton(sectionId: string): Locator {
    return this.getSectionItem(sectionId).locator('button:has(svg[data-icon="chevron-down"])')
  }

  getSectionDeleteButton(sectionId: string): Locator {
    return this.getSectionItem(sectionId).locator('button:has(svg[data-icon="trash"])')
  }

  // Theme Settings
  get colorSettings(): Locator {
    return this.page.locator('.theme-settings .colors, [data-testid="color-settings"]')
  }

  get typographySettings(): Locator {
    return this.page.locator('.theme-settings .typography, [data-testid="typography-settings"]')
  }

  get layoutSettings(): Locator {
    return this.page.locator('.theme-settings .layout, [data-testid="layout-settings"]')
  }

  getColorInput(colorName: string): Locator {
    return this.page.locator(`input[type="color"][value*="${colorName}"], input[data-color="${colorName}"]`)
  }

  getFontSelect(fontType: 'heading' | 'body'): Locator {
    return this.page.locator(`select[data-font="${fontType}"], [data-testid="${fontType}-font"]`)
  }

  getPageWidthSlider(): Locator {
    return this.page.locator('[data-testid="page-width-slider"], input[type="range"][data-setting="page_width"]')
  }

  // Custom Code
  get customCSSTextarea(): Locator {
    return this.page.locator('textarea[placeholder*="CSS"], [data-testid="custom-css"]')
  }

  get customJSTextarea(): Locator {
    return this.page.locator('textarea[placeholder*="JavaScript"], [data-testid="custom-js"]')
  }

  get customHeadHTMLTextarea(): Locator {
    return this.page.locator('textarea[placeholder*="head"], [data-testid="custom-head-html"]')
  }

  // Actions
  async switchToSectionsTab() {
    await this.sectionsTab.click()
    await this.page.waitForTimeout(500)
  }

  async switchToThemeSettingsTab() {
    await this.themeSettingsTab.click()
    await this.page.waitForTimeout(500)
  }

  async switchToCustomCodeTab() {
    await this.customCodeTab.click()
    await this.page.waitForTimeout(500)
  }

  async switchPreviewMode(mode: 'desktop' | 'tablet' | 'mobile') {
    const button = mode === 'desktop' ? this.desktopPreviewButton :
                  mode === 'tablet' ? this.tabletPreviewButton :
                  this.mobilePreviewButton
    
    await button.click()
    await this.page.waitForTimeout(500)
  }

  async addSection(sectionType: string) {
    await this.switchToSectionsTab()
    await this.getAddSectionButton(sectionType).click()
    await this.page.waitForTimeout(1000)
  }

  async removeSection(sectionId: string) {
    await this.getSectionDeleteButton(sectionId).click()
    await this.page.waitForTimeout(500)
  }

  async moveSectionUp(sectionId: string) {
    await this.getSectionMoveUpButton(sectionId).click()
    await this.page.waitForTimeout(500)
  }

  async moveSectionDown(sectionId: string) {
    await this.getSectionMoveDownButton(sectionId).click()
    await this.page.waitForTimeout(500)
  }

  async toggleSectionVisibility(sectionId: string) {
    await this.getSectionVisibilityToggle(sectionId).click()
    await this.page.waitForTimeout(500)
  }

  async selectSection(sectionId: string) {
    await this.getSectionItem(sectionId).click()
    await this.page.waitForTimeout(500)
  }

  // Theme Settings Actions
  async changeColor(colorName: string, colorValue: string) {
    await this.switchToThemeSettingsTab()
    const colorInput = this.getColorInput(colorName)
    await colorInput.fill(colorValue)
    await this.page.waitForTimeout(500)
  }

  async changeFont(fontType: 'heading' | 'body', fontValue: string) {
    await this.switchToThemeSettingsTab()
    const fontSelect = this.getFontSelect(fontType)
    await fontSelect.selectOption(fontValue)
    await this.page.waitForTimeout(500)
  }

  async changePageWidth(width: number) {
    await this.switchToThemeSettingsTab()
    const slider = this.getPageWidthSlider()
    
    // Set slider value
    await slider.fill(width.toString())
    await this.page.waitForTimeout(500)
  }

  // Custom Code Actions
  async addCustomCSS(css: string) {
    await this.switchToCustomCodeTab()
    await this.customCSSTextarea.fill(css)
    await this.page.waitForTimeout(500)
  }

  async addCustomJS(js: string) {
    await this.switchToCustomCodeTab()
    await this.customJSTextarea.fill(js)
    await this.page.waitForTimeout(500)
  }

  async addCustomHeadHTML(html: string) {
    await this.switchToCustomCodeTab()
    await this.customHeadHTMLTextarea.fill(html)
    await this.page.waitForTimeout(500)
  }

  // Save and Publish
  async saveChanges() {
    await this.saveButton.click()
    await this.page.waitForTimeout(2000)
  }

  async publishTheme() {
    await this.publishButton.click()
    await this.page.waitForTimeout(3000)
  }

  async undoLastChange() {
    await this.undoButton.click()
    await this.page.waitForTimeout(500)
  }

  async redoLastChange() {
    await this.redoButton.click()
    await this.page.waitForTimeout(500)
  }

  // Validation
  async expectSectionVisible(sectionId: string) {
    const section = this.getSectionItem(sectionId)
    await expect(section).toBeVisible()
  }

  async expectSectionCount(count: number) {
    const sections = this.sectionsList.locator('.section-item, [data-section-id]')
    await expect(sections).toHaveCount(count)
  }

  async expectPreviewModeActive(mode: 'desktop' | 'tablet' | 'mobile') {
    const button = mode === 'desktop' ? this.desktopPreviewButton :
                  mode === 'tablet' ? this.tabletPreviewButton :
                  this.mobilePreviewButton
    
    await expect(button).toHaveAttribute('aria-pressed', 'true')
  }

  async expectCustomCSSApplied(css: string) {
    const styles = await this.page.locator('style, link[rel="stylesheet"]').allTextContents()
    const hasCustomCSS = styles.some(style => style.includes(css.replace(/\s+/g, ' ').trim()))
    expect(hasCustomCSS).toBeTruthy()
  }

  async expectSectionOrder(sectionIds: string[]) {
    const sections = await this.sectionsList.locator('[data-section-id]').all()
    const actualOrder = await Promise.all(
      sections.map(section => section.getAttribute('data-section-id'))
    )
    expect(actualOrder).toEqual(sectionIds)
  }

  // Security Testing
  async testMaliciousCSSInjection(maliciousCSS: string) {
    await this.addCustomCSS(maliciousCSS)
    
    // Check if malicious content was sanitized
    const pageContent = await this.page.content()
    const hasScript = pageContent.includes('<script>') || 
                     pageContent.includes('javascript:')
    
    return !hasScript // Should return true if safe
  }

  async testMaliciousJSInjection(maliciousJS: string) {
    await this.addCustomJS(maliciousJS)
    
    // Check if JavaScript is executed in sandbox
    const alerts = []
    this.page.on('dialog', dialog => {
      alerts.push(dialog.message())
      dialog.dismiss()
    })
    
    await this.page.waitForTimeout(2000)
    
    // Should not have any alerts if properly sandboxed
    return alerts.length === 0
  }

  async testMaliciousHTMLInjection(maliciousHTML: string) {
    await this.addCustomHeadHTML(maliciousHTML)
    
    const pageContent = await this.page.content()
    const dangerousTags = ['<script>', '<iframe>', '<object>', '<embed>']
    const hasDangerousTags = dangerousTags.some(tag => 
      pageContent.toLowerCase().includes(tag)
    )
    
    return !hasDangerousTags // Should return true if safe
  }

  // Performance Testing
  async measureCustomizerLoadTime(): Promise<number> {
    const startTime = Date.now()
    await this.openCustomizer()
    await this.page.waitForSelector('.theme-customizer', { state: 'visible' })
    return Date.now() - startTime
  }

  async measurePreviewSwitchTime(mode: 'desktop' | 'tablet' | 'mobile'): Promise<number> {
    const startTime = Date.now()
    await this.switchPreviewMode(mode)
    await this.page.waitForTimeout(500) // Wait for transition
    return Date.now() - startTime
  }
}
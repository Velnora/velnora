import { BaseClassContext } from "../base-class.context";
import { AppsContext } from "./project-structure/apps.context";
import { TemplateContext } from "./project-structure/template.context";

export class ProjectStructure extends BaseClassContext {
  private _apps?: AppsContext;
  private _template?: TemplateContext;

  get apps() {
    if (!this._apps) this._apps = new AppsContext(this.pageCtx);
    return this._apps;
  }

  get template() {
    if (!this._template) this._template = new TemplateContext(this.pageCtx);
    return this._template;
  }

  checks() {
    this.apps.checks();
    this.template.checks();
  }
}

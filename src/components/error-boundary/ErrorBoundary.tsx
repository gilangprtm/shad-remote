import { Component, type ReactNode } from "react";
export class ErrorBoundary extends Component<{fallback?:ReactNode,children:ReactNode},{hasError:boolean}>{
  state={hasError:false};
  static getDerivedStateFromError(){return {hasError:true};}
  render(){ if(this.state.hasError) return this.props.fallback ?? <div className="edjavu-error">Remote component failed to load. Please retry.</div>; return this.props.children; }
}
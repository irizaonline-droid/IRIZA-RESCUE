// Identify credential-shaped values without treating variable names or env references as secrets.
// Results contain location and category only; matched values are never returned.
export function sourceSecretFindings(source){
 const patterns=[['provider credential',/\b(?:LLM_\d+_[A-Za-z0-9_-]+|sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[A-Z0-9]{16})\b/g],['private key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],['literal credential',/\b(?:password|secret|token|api[_-]?key|authorization)\b["']?\s*[=:]\s*(["'`])([^"'`\r\n]{4,})\1/gi],['bearer credential',/\bBearer\s+[A-Za-z0-9_.-]{16,}/g]];
 const findings=[];for(const [kind,pattern] of patterns)for(const match of source.matchAll(pattern)){if(kind==='literal credential'&&(/^(?:\$\{|process\.env|<|\[REDACTED|__RESCUE)/.test(match[2])||/^(?:test|example|placeholder|changeme|dummy)[-_ ]/i.test(match[2])))continue;findings.push({kind,line:source.slice(0,match.index).split('\n').length});if(findings.length>=50)return findings;}return findings;
}

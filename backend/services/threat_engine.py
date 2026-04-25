import random

def calculate_threat_score(modules):
    # Average integrity of modules
    total_integrity = sum(m['integrity'] for m in modules.values())
    avg_integrity = total_integrity / len(modules)
    
    # Invert integrity to get threat potential
    base_score = 100 - avg_integrity
    
    # Add factor for active alerts
    total_alerts = sum(m['alerts'] for m in modules.values())
    alert_factor = min(40, total_alerts * 5)
    
    final_score = int(min(100, base_score + alert_factor))
    
    level = "LOW"
    if final_score > 80: level = "CRITICAL"
    elif final_score > 60: level = "HIGH"
    elif final_score > 30: level = "MEDIUM"
    
    return final_score, level

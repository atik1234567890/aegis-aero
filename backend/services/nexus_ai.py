import os
import google.generativeai as genai
from loguru import logger

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    try:
        genai.configure(api_key=api_key)
        # Standard model name without models/ prefix often works better with v1beta
        model = genai.GenerativeModel('gemini-1.5-flash')
        logger.info("NexusAI: Gemini Engine Initialized")
    except Exception as e:
        model = None
        logger.error(f"NexusAI: Failed to initialize Gemini - {e}")
else:
    model = None
    logger.warning("NexusAI: GEMINI_API_KEY not found. Using rule-based analysis.")

def generate_analysis(system_state: dict = None):
    """
    Generates intelligent analysis based on current system state.
    Uses Gemini if API key is available, otherwise falls back to rule-based logic.
    """
    if not system_state:
        return "System standby. Monitoring all sectors for anomalous activity."

    threat_score = system_state.get("threat_score", 0)
    threat_level = system_state.get("threat_level", "LOW")
    active_modules = system_state.get("active_modules", {})
    
    if model and api_key:
        try:
            prompt = f"""
            As AEGIS-AERO AI (Nexus AI), analyze the following airport security system state:
            - Threat Score: {threat_score}/100
            - Threat Level: {threat_level}
            - Module Status: {active_modules}
            
            Provide a concise, professional security briefing (max 2 sentences). 
            Focus on the most critical alerts or anomalies.
            """
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"NexusAI: Gemini Error - {str(e)}")

    # Rule-based fallback (more realistic than random)
    if threat_level == "CRITICAL":
        return f"CRITICAL ALERT: Threat score reached {threat_score}. Coordinated attack patterns detected. Recommend immediate lockdown of affected sectors."
    elif threat_level == "HIGH":
        return f"High alert state. Significant anomalies detected in {list(active_modules.keys())[0]}. Security teams briefed and on standby."
    elif threat_level == "MEDIUM":
        return "Elevated monitoring in progress. Minor network perturbations and unidentified drone tracks detected. Investigating correlations."
    else:
        return "System nominal. All modules reporting integrity within safe parameters. No immediate threats detected."

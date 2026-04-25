import random

scenarios = [
    "Coordinated attack pattern detected. GPS spoofing correlates with network intrusion attempt. Possible state-level threat actor. Recommend: Activate backup navigation systems.",
    "Unidentified drone cluster detected in Sector 7. DarkHawk signal jamming in progress. ATC notified for immediate runway diversion.",
    "Multiple high-confidence weapon detections at Terminal 3. PerimeterMind sensors indicate unauthorized access at Gate B4. Rapid response teams deployed.",
    "Anomalous GPS drift increasing in approach corridor. CyberGuard IDS blocking active ARP poisoning attempt. Integrity of landing systems is COMPROMISED.",
    "System nominal. Routine maintenance drone verified in Sector NW. All security parameters within standard deviation."
]

def generate_analysis():
    return random.choice(scenarios)

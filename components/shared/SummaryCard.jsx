import React, {cloneElement} from 'react';
import PropTypes from 'prop-types';
import { Card , CardContent} from '@/components/ui/card';

function SummaryCard({ title, value, unit = "", icon, color }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50",
        emerald: "text-emerald-600 bg-emerald-50",
        orange: "text-orange-600 bg-orange-50",
        purple: "text-purple-600 bg-purple-50"
    };
    return (
        <Card className="border-none shadow-sm rounded-[24px] transition-all hover:shadow-md group">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.15em] mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-gray-800">{typeof value === 'string' || typeof value === 'number' ? value : 'N/A'} <span className="text-sm font-medium text-gray-400">{unit}</span></h3>
                </div>
                <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${colors[color]}`}>
                    {React.isValidElement(icon) ? cloneElement(icon, { className: "h-6 w-6" }) : null}
                </div>
            </CardContent>
        </Card>
    );
}

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
};

SummaryCard.defaultProps = {
  unit: '',
};

export default SummaryCard;
import { Path, Svg } from 'react-native-svg'

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { createIcon } from '../factories/createIcon'

export const [LineChartDots, AnimatedLineChartDots] = createIcon({
  name: 'LineChartDots',
  getIcon: (props) => (
    <Svg fill="none" viewBox="0 0 20 20" {...props}>
      <Path
        d="M19.1833 7.5C19.1833 8.42 18.4367 9.16667 17.5167 9.16667C17.2817 9.16667 17.0583 9.11663 16.855 9.02913L14.0458 11.8384C14.1333 12.0417 14.1842 12.2642 14.1842 12.5C14.1842 13.42 13.4375 14.1667 12.5175 14.1667C11.5975 14.1667 10.8467 13.42 10.8467 12.5C10.8467 12.2725 10.8925 12.0558 10.975 11.8575L8.15584 9.03829C7.95917 9.11996 7.74333 9.16585 7.5175 9.16585C7.2825 9.16585 7.05918 9.11582 6.85584 9.02832L4.04667 11.8376C4.13417 12.0409 4.18501 12.2634 4.18501 12.4992C4.18501 13.4192 3.43834 14.1659 2.51834 14.1659C1.59834 14.1659 0.847504 13.4192 0.847504 12.4992C0.847504 11.5792 1.58917 10.8325 2.51 10.8325H2.51834C2.74501 10.8325 2.96 10.8784 3.15667 10.9601L5.97667 8.14006C5.89417 7.94256 5.8475 7.72585 5.8475 7.49919C5.8475 6.57919 6.58917 5.83252 7.51 5.83252H7.51834C8.43834 5.83252 9.18501 6.57919 9.18501 7.49919C9.18501 7.73419 9.13501 7.95747 9.04667 8.16081L11.8533 10.9674C12.0542 10.8807 12.2758 10.8325 12.5092 10.8325H12.5175C12.7442 10.8325 12.9592 10.8784 13.1558 10.9601L15.9758 8.14006C15.8933 7.94256 15.8467 7.72585 15.8467 7.49919C15.8467 6.57919 16.5883 5.83252 17.5092 5.83252H17.5175C18.4375 5.83335 19.1833 6.58 19.1833 7.5Z"
        fill={'currentColor' ?? '#7D7D7D'}
      />
    </Svg>
  ),
  defaultFill: '#7D7D7D',
})
